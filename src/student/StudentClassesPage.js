import React, { Component } from 'react'
import { Button, Textbox, SmallButton } from '../Components'
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
			joinClassModalIsLoading: false
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
		this.setState({ joinClassModalOpen: false, joinClassModalCode: '' })
	}

	onJoinClassModalCodeChange = joinClassModalCode => {
		if (joinClassModalCode.length <= 8) this.setState({ joinClassModalCode })
	}

	joinClass = async () => {
		let code = this.state.joinClassModalCode
		if (isOnlyWhitespace(code) || this.state.joinClassModalIsLoading) return
		this.setState({ joinClassModalIsLoading: true })

		await joinClass(code)

		this.closeJoinClassModal()
		this.setState({ joinClassModalIsLoading: false })
		this.fetchClasses()
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
				<Modal
					isOpen={this.state.joinClassModalOpen}
					onRequestClose={this.closeJoinClassModal}
					style={modalStyle}
					contentLabel="Join Class">
					<h3>Join Class</h3>
					<Textbox
						className="full-width"
						placeholder="Class Code"
						onTextChange={this.onJoinClassModalCodeChange}
						onEnter={this.joinClass}
					/>
					<Button
						text="Join"
						onClick={this.joinClass}
						disabled={isOnlyWhitespace(this.state.joinClassModalCode)}
					/>
					<Button text="Cancel" onClick={this.closeJoinClassModal} />
					{this.state.joinClassModalIsLoading && <h5>Loading...</h5>}
				</Modal>
				<div className="container-fluid" style={{ padding: 0 }}>
					<div className="row" style={{ margin: 0 }}>
						<h2 className="before-button">Your Classes</h2>
						<Button text="Join Class" onClick={this.openJoinClassModal} />
						<SmallButton
							style={{ marginTop: '0.5rem' }}
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
