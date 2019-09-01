import React, { Component } from 'react'
import { Button, Table, Textbox } from '../Components'
import { teacherFetchClasses, createClass } from '../API'
import Modal from 'react-modal'
const isOnlyWhitespace = require('../helper').isOnlyWhitespace

Modal.setAppElement('#root')
const customStyles = {
	content: {
		top: '50%',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		marginRight: '-50%',
		transform: 'translate(-50%, -50%)',
		border: 'none',
		boxShadow:
			'0 4px 8px 0 rgba(0, 0, 0, 0.12), 0 2px 4px 0 rgba(0, 0, 0, 0.08)'
	}
}

export default class TeacherClassesPage extends Component {
	constructor(props) {
		super(props)

		this.state = {
			classes: [],
			newClassModalOpen: false,
			newClassNameText: '',
			isLoading: false
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

	newClass = () => {
		this.setState({ newClassModalOpen: true })
	}

	closeNewClassModal = () => {
		this.setState({ newClassModalOpen: false, newClassNameText: '' })
	}

	newClassNameChange = newClassNameText => {
		this.setState({ newClassNameText })
	}

	createClass = async () => {
		if (isOnlyWhitespace(this.state.newClassNameText) || this.state.isLoading)
			return
		let name = this.state.newClassNameText

		this.setState({ isLoading: true })
		await createClass(name)
		this.closeNewClassModal()
		this.setState({ isLoading: false })

		this.fetchClasses()
	}

	render() {
		return (
			<div className="content">
				<Modal
					isOpen={this.state.newClassModalOpen}
					onRequestClose={this.closeNewClassModal}
					style={customStyles}
					contentLabel="New Class">
					<h3>New Class</h3>
					<Textbox
						placeholder="Class Name"
						onTextChange={this.newClassNameChange}
						text={this.state.newClassNameText}
						onEnter={this.createClass}
					/>
					<Button
						text="Create Class"
						onClick={this.createClass}
						disabled={isOnlyWhitespace(this.state.newClassNameText)}
					/>
					<Button text="Cancel" onClick={this.closeNewClassModal} />
					{this.state.isLoading && <h5 className="">Loading...</h5>}
				</Modal>
				<div className="container-fluid" style={{ padding: 0 }}>
					<div className="row" style={{ margin: 0 }}>
						<h2 className="before-button">Your Classes</h2>
						<Button text="New Class" onClick={this.newClass} />
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
						<tbody>
							{this.state.classes.map((c, i) => (
								<tr className="class-item" onClick={() => this.selectClass(i)}>
									<td>{c.name}</td>
									<td>{c.students.length}</td>
									<td>{c.problemSets.length}</td>
									<td>{c.code}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		)
	}
}
