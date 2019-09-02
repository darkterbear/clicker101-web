import React, { Component } from 'react'
import { Button, Textbox } from '../Components'
import queryString from 'query-string'
import { teacherFetchClass, createProblemSet } from '../API'
import Modal from 'react-modal'
const { isOnlyWhitespace, modalStyle, formatDate } = require('../helper')

Modal.setAppElement('#root')

export default class TeacherClassPage extends Component {
	constructor(props) {
		super(props)

		this.state = {
			class: {
				name: ''
			},
			newPSModalOpen: false,
			newPSModalName: '',
			newPSModalIsLoading: false
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

	closeNewPSModal = () => {
		this.setState({ newPSModalOpen: false, newPSModalName: '' })
	}

	onNewPSModalNameChange = newPSModalName => {
		this.setState({ newPSModalName })
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

	render() {
		return (
			<div className="content">
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
						text={this.state.newPSModalName}
						onEnter={this.createProblemSet}
					/>
					<Button
						text="Create Problem Set"
						onClick={this.createProblemSet}
						disabled={isOnlyWhitespace(this.state.newPSModalName)}
					/>
					<Button text="Cancel" onClick={this.closeNewPSModal} />
					{this.state.newPSModalIsLoading && <h5 className="">Loading...</h5>}
				</Modal>
				<div className="container-fluid" style={{ padding: 0 }}>
					<div className="row" style={{ margin: 0 }}>
						<h2 className="before-button">{this.state.class.name}</h2>
						<Button text="New Problem Set" onClick={this.openNewPSModal} />
					</div>
					<table className="table">
						<thead>
							<tr>
								<th>Problem Set Name</th>
								<th>Problems</th>
								<th>Date Created</th>
							</tr>
						</thead>
						<tbody>
							{this.state.class.problemSets &&
								this.state.class.problemSets.map((p, i) => (
									<tr
										key={p._id}
										className="class-item"
										onClick={() => this.selectProblemSet(i)}>
										<td>{p.name}</td>
										<td>{p.problems.length}</td>
										<td>{formatDate(new Date(p.date))}</td>
									</tr>
								))}
						</tbody>
					</table>
				</div>
			</div>
		)
	}
}
