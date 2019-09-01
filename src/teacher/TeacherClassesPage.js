import React, { Component } from 'react'
import { Button, Table } from '../Components'
import { teacherFetchClasses } from '../API'

export default class TeacherClassesPage extends Component {
	constructor(props) {
		super(props)

		this.state = {
			classes: []
		}
	}

	async componentDidMount() {
		let classesResponse = await teacherFetchClasses()
		if (classesResponse.status !== 200) {
			this.props.history.push('/login')
			return
		}

		let classes = await classesResponse.json()
		this.setState({ classes })
		console.log(classes)
	}

	selectClass = i => {}

	newClass = () => {}

	render() {
		return (
			<div className="content">
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
