import React, { Component } from 'react'
import { Button, Textbox, SmallButton, LoadingBar } from '../Components'
import queryString from 'query-string'
import {
	teacherFetchClass,
	createProblemSet,
	editClassName,
	deleteClass
} from '../api/teacher'
import Modal from 'react-modal'
import QRCode from 'qrcode.react'
import { logout } from '../api'
const { isOnlyWhitespace, modalStyle, formatDate } = require('../helper')

Modal.setAppElement('#root')

export default class TeacherClassPage extends Component {
	constructor(props) {
		super(props)

		this.state = {
			class: {
				name: 'Loading...',
				problemSets: []
			},
			newPSModalOpen: false,
			newPSModalName: '',
			newPSModalIsLoading: false,

			settingsModalOpen: false,
			settingsModalName: '',
			settingsModalIsLoading: false,

			qrModalOpen: false
		}
	}

	async componentDidMount() {
		this.fetchClass()
	}

	fetchClass = async () => {
		let { id } = queryString.parse(this.props.location.search)
		let classResponse = await teacherFetchClass(id)
		if (classResponse.status !== 200) {
			this.props.history.push('/login')
			return
		}

		let classObj = await classResponse.json()
		this.setState({ class: classObj })
	}

	selectProblemSet = i => {
		this.props.history.push(
			`/teacher/problem-set?id=${this.state.class.problemSets[i]._id}`
		)
	}

	openNewPSModal = () => {
		this.setState({ newPSModalOpen: true })
	}

	openSettingsModal = () => {
		this.setState({
			settingsModalOpen: true,
			settingsModalName: this.state.class.name
		})
	}

	openQRModal = () => {
		this.setState({ qrModalOpen: true })
	}

	closeNewPSModal = () => {
		this.setState({ newPSModalOpen: false, newPSModalName: '' })
	}

	closeSettingsModal = () => {
		this.setState({ settingsModalOpen: false, settingsModalName: '' })
	}

	closeQRModal = () => {
		this.setState({ qrModalOpen: false })
	}

	onNewPSModalNameChange = newPSModalName => {
		this.setState({ newPSModalName })
	}

	onSettingsModalNameChange = settingsModalName => {
		this.setState({ settingsModalName })
	}

	createProblemSet = async () => {
		let name = this.state.newPSModalName
		if (isOnlyWhitespace(name) || this.state.newPSModalIsLoading) return
		this.setState({ newPSModalIsLoading: true })

		await createProblemSet(name, this.state.class._id)

		this.closeNewPSModal()
		this.setState({ newPSModalIsLoading: false })
		this.fetchClass()
	}

	editClassName = async () => {
		let newName = this.state.settingsModalName
		if (
			isOnlyWhitespace(newName) ||
			this.state.settingsModalIsLoading ||
			newName === this.state.class.name
		)
			return
		this.setState({ settingsModalIsLoading: true })

		await editClassName(newName, this.state.class._id)

		this.closeSettingsModal()
		this.setState({ settingsModalIsLoading: false })
		this.fetchClass()
	}

	deleteClass = async () => {
		await deleteClass(this.state.class._id)
		this.closeSettingsModal()
		this.props.history.push('/teacher/classes')
	}

	logout = async () => {
		await logout()
		this.props.history.push('/login')
	}

	render() {
		let problemSets =
			this.state.class.problemSets &&
			this.state.class.problemSets.map((p, i) => {
				let status = 'Not Started'
				if (p.executionDate) {
					if (p.currentProblem === null) status = 'Completed'
					else status = 'In Progress'
				}

				return (
					<tr
						key={p._id}
						className="class-item"
						onClick={() => this.selectProblemSet(i)}>
						<td>{p.name}</td>
						<td>{status}</td>
						<td>{formatDate(new Date(p.date))}</td>
					</tr>
				)
			})

		return (
			<div className="content">
				<LoadingBar
					show={
						this.state.newPSModalIsLoading || this.state.settingsModalIsLoading
					}
				/>
				{/* New problem set modal */}
				<Modal
					isOpen={this.state.newPSModalOpen}
					onRequestClose={this.closeNewPSModal}
					style={modalStyle}
					contentLabel="New Problem Set">
					<h3>New Problem Set</h3>
					<Textbox
						placeholder="Problem Set Name"
						className="full-width"
						onTextChange={this.onNewPSModalNameChange}
						onEnter={this.createProblemSet}
					/>
					<Button
						text="Create Problem Set"
						onClick={this.createProblemSet}
						disabled={isOnlyWhitespace(this.state.newPSModalName)}
					/>
					<Button text="Cancel" onClick={this.closeNewPSModal} />
				</Modal>
				{/* Settings modal */}
				<Modal
					isOpen={this.state.settingsModalOpen}
					onRequestClose={this.closeSettingsModal}
					style={modalStyle}
					contentLabel="Class Settings">
					<h3>Class Settings</h3>
					<Textbox
						placeholder="Class Name"
						className="full-width"
						text={this.state.settingsModalName}
						onTextChange={this.onSettingsModalNameChange}
						onEnter={this.editClassName}
					/>
					<Button
						text="Save"
						onClick={this.editClassName}
						disabled={isOnlyWhitespace(this.state.settingsModalName)}
					/>
					<Button
						text="Delete Class"
						warning={true}
						onClick={this.deleteClass}
					/>
					<Button text="Cancel" onClick={this.closeSettingsModal} />
				</Modal>
				{/* QR modal */}
				<Modal
					isOpen={this.state.qrModalOpen}
					onRequestClose={this.closeQRModal}
					style={modalStyle}
					contentLabel="Class QR Code">
					<h3>Class QR Code</h3>
					<div className="row v-center-content">
						<h1>{this.state.class.code}</h1>
					</div>
					<div className="row v-center-content">
						<QRCode value={this.state.class.code} size={256} />
					</div>
				</Modal>
				<div className="container-fluid">
					<div className="row">
						<h2 className="before-button">{this.state.class.name}</h2>
						<Button text="New Problem Set" onClick={this.openNewPSModal} />
						<SmallButton
							text="QR Code"
							onClick={this.openQRModal}
							className="right"
						/>
						<SmallButton text="Settings" onClick={this.openSettingsModal} />
						<SmallButton text="Log Out" onClick={this.logout} />
					</div>
					<table className="table">
						<thead>
							<tr>
								<th>Problem Set Name</th>
								<th>Status</th>
								<th>Date Created</th>
							</tr>
						</thead>
						<tbody>{problemSets}</tbody>
					</table>
				</div>
			</div>
		)
	}
}
