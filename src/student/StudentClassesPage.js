import React, { Component } from 'react'
import { Button, Textbox, SmallButton, LoadingBar } from '../Components'
import { studentFetchClasses, joinClass } from '../api/student'
import Modal from 'react-modal'
import { logout } from '../api'
const { isOnlyWhitespace, modalStyle } = require('../helper')

Modal.setAppElement('#root')

export default class StudentClassesPage extends Component {
	constructor(props) {
		super(props)

		this.state = {
			classes: [],
			joinClassModalOpen: false,
			joinClassModalCode: '',
			joinClassModalIsLoading: false,
			joinClassModalErrorMessage: ''
		}
	}

	async componentDidMount() {
		this.fetchClasses()
	}

	fetchClasses = async () => {
		let classesResponse = await studentFetchClasses()
		if (classesResponse.status !== 200) {
			this.props.history.push('/login')
			return
		}

		let classes = await classesResponse.json()
		this.setState({ classes })
	}

	selectClass = i => {
		this.props.history.push(`/student/class?id=${this.state.classes[i]._id}`)
	}

	openJoinClassModal = () => {
		this.setState({ joinClassModalOpen: true })
	}

	closeJoinClassModal = () => {
		this.setState({
			joinClassModalOpen: false,
			joinClassModalCode: '',
			joinClassModalErrorMessage: ''
		})
	}

	onJoinClassModalCodeChange = joinClassModalCode => {
		this.setState({ joinClassModalCode })
	}

	joinClass = async () => {
		let code = this.state.joinClassModalCode
		if (this.state.joinClassModalIsLoading) return
		if (code.length !== 6) {
			this.setState({
				joinClassModalErrorMessage: 'Please enter a valid class code'
			})
			return
		}

		this.setState({
			joinClassModalIsLoading: true,
			joinClassModalErrorMessage: ''
		})

		let joinClassResponse = await joinClass(code)

		if (joinClassResponse.status === 200) {
			this.closeJoinClassModal()
			this.setState({ joinClassModalIsLoading: false })
			this.fetchClasses()
		} else
			this.setState({
				joinClassModalIsLoading: false,
				joinClassModalErrorMessage: 'Incorrect class code'
			})
	}

	logout = async () => {
		await logout()
		this.props.history.push('/login')
	}

	render() {
		let classes = this.state.classes.map((c, i) => (
			<tr
				className="class-item"
				key={c._id}
				onClick={() => this.selectClass(i)}>
				<td>{c.name}</td>
			</tr>
		))

		return (
			<div className="content">
				<LoadingBar show={this.state.joinClassModalIsLoading} />
				<Modal
					isOpen={this.state.joinClassModalOpen}
					onRequestClose={this.closeJoinClassModal}
					style={modalStyle}
					contentLabel="Join Class">
					<h3>Join Class</h3>
					<Textbox
						className="full-width"
						placeholder="Class Code"
						maxlength={6}
						onTextChange={this.onJoinClassModalCodeChange}
						onEnter={this.joinClass}
					/>
					<Button
						text="Join"
						onClick={this.joinClass}
						disabled={this.state.joinClassModalCode.length !== 6}
					/>
					<Button text="Cancel" onClick={this.closeJoinClassModal} />
					{this.state.joinClassModalErrorMessage && (
						<h5 className="error">{this.state.joinClassModalErrorMessage}</h5>
					)}
				</Modal>
				<div className="container-fluid">
					<div className="row">
						<h2 className="before-button">Your Classes</h2>
						<Button text="Join Class" onClick={this.openJoinClassModal} />
						<SmallButton
							className="right"
							text="Log Out"
							onClick={this.logout}
						/>
					</div>
					<table className="table">
						<thead>
							<tr>
								<th>Class Name</th>
							</tr>
						</thead>
						<tbody>{classes}</tbody>
					</table>
				</div>
			</div>
		)
	}
}
