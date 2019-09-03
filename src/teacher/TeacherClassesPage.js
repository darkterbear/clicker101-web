import React, { Component } from 'react'
import { Button, Textbox } from '../Components'
import { teacherFetchClasses, createClass } from '../API'
import Modal from 'react-modal'
const { isOnlyWhitespace, modalStyle } = require('../helper')

Modal.setAppElement('#root')

export default class TeacherClassesPage extends Component {
	constructor(props) {
		super(props)

		this.state = {
			classes: [],
			newClassModalOpen: false,
			newClassModalName: '',
			newClassModalIsLoading: false
		}
	}

	async componentDidMount() {
		this.fetchClasses()
	}

	fetchClasses = async () => {
		let classesResponse = await teacherFetchClasses()
		if (classesResponse.status !== 200) {
			this.props.history.push('/login')
			return
		}

		let classes = await classesResponse.json()
		this.setState({ classes })
	}

	selectClass = i => {
		this.props.history.push(`/teacher/class?id=${this.state.classes[i]._id}`)
	}

	openNewClassModal = () => {
		this.setState({ newClassModalOpen: true })
	}

	closeNewClassModal = () => {
		this.setState({ newClassModalOpen: false, newClassModalName: '' })
	}

	onNewClassModalNameChange = newClassModalName => {
		this.setState({ newClassModalName })
	}

	createClass = async () => {
		let name = this.state.newClassModalName
		if (isOnlyWhitespace(name) || this.state.newClassModalIsLoading) return
		this.setState({ newClassModalIsLoading: true })

		await createClass(name)

		this.closeNewClassModal()
		this.setState({ newClassModalIsLoading: false })
		this.fetchClasses()
	}

	render() {
		let classes = this.state.classes.map((c, i) => (
			<tr
				className="class-item"
				key={c._id}
				onClick={() => this.selectClass(i)}>
				<td>{c.name}</td>
				<td>{c.students.length}</td>
				<td>{c.problemSets.length}</td>
				<td>{c.code}</td>
			</tr>
		))

		return (
			<div className="content">
				<Modal
					isOpen={this.state.newClassModalOpen}
					onRequestClose={this.closeNewClassModal}
					style={modalStyle}
					contentLabel="New Class">
					<h3>New Class</h3>
					<Textbox
						className="full-width"
						placeholder="Class Name"
						onTextChange={this.onNewClassModalNameChange}
						onEnter={this.createClass}
					/>
					<Button
						text="Create Class"
						onClick={this.createClass}
						disabled={isOnlyWhitespace(this.state.newClassModalName)}
					/>
					<Button text="Cancel" onClick={this.closeNewClassModal} />
					{this.state.newClassModalIsLoading && (
						<h5 className="">Loading...</h5>
					)}
				</Modal>
				<div className="container-fluid" style={{ padding: 0 }}>
					<div className="row" style={{ margin: 0 }}>
						<h2 className="before-button">Your Classes</h2>
						<Button text="New Class" onClick={this.openNewClassModal} />
					</div>
					<table className="table">
						<thead>
							<tr>
								<th>Class Name</th>
								<th>Students</th>
								<th>Problem Sets</th>
								<th>Code</th>
							</tr>
						</thead>
						<tbody>{classes}</tbody>
					</table>
				</div>
			</div>
		)
	}
}
