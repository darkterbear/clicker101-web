import React, { Component } from 'react'
import { Button, Table, Textbox } from '../Components'
import queryString from 'query-string'
import { teacherFetchClass } from '../API'

export default class TeacherClassPage extends Component {
	constructor(props) {
		super(props)

		this.state = {
			class: {
				name: ''
			}
		}
	}

	async componentDidMount() {
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
			`/teacher/problem-set?id=${this.state.problemSets[i]._id}`
		)
	}

	newProblemSet = () => {
		// TODO:
	}

	render() {
		return (
			<div className="content">
				<div className="container-fluid" style={{ padding: 0 }}>
					<div className="row" style={{ margin: 0 }}>
						<h2 className="before-button">{this.state.class.name}</h2>
						<Button text="New Problem Set" onClick={this.newProblemSet} />
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
										className="class-item"
										onClick={() => this.selectProblemSet(i)}>
										<td>{p.name}</td>
										<td>{p.problems.length}</td>
										<td>{p.date}</td>
									</tr>
								))}
						</tbody>
					</table>
				</div>
			</div>
		)
	}
}
