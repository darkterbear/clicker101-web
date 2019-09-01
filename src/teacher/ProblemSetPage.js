import React, { Component } from 'react'
import { Button, Table, Textbox } from '../Components'
import queryString from 'query-string'
import { teacherFetchClass, teacherFetchProblemSet } from '../API'

export default class ProblemSetPage extends Component {
	constructor(props) {
		super(props)

		this.state = {
			problemSet: {
				name: ''
			}
		}
	}

	async componentDidMount() {
		let { id } = queryString.parse(this.props.location.search)
		let problemSetResponse = await teacherFetchProblemSet(id)
		if (problemSetResponse.status !== 200) {
			this.props.history.push('/login')
			return
		}

		let problemSet = await problemSetResponse.json()
		this.setState({ problemSet })
	}

	selectProblem = i => {
		// TODO:
	}

	newProblem = () => {
		// TODO:
	}

	render() {
		return (
			<div className="content">
				<div className="container-fluid" style={{ padding: 0 }}>
					<div className="row" style={{ margin: 0 }}>
						<h2 className="before-button">{this.state.problemSet.name}</h2>
						<Button text="New Problem" onClick={this.newProblem} />
					</div>
					<table className="table">
						<thead>
							<tr>
								<th>Question</th>
							</tr>
						</thead>
						<tbody>
							{this.state.problemSet.problems &&
								this.state.problemSet.problems.map((p, i) => (
									<tr
										className="class-item"
										onClick={() => this.selectProblemSet(i)}>
										<td>{p.question}</td>
									</tr>
								))}
						</tbody>
					</table>
				</div>
			</div>
		)
	}
}
