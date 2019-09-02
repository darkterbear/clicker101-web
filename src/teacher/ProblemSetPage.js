import React, { Component } from 'react'
import { Button, Table, Textbox } from '../Components'
import queryString from 'query-string'
import { teacherFetchProblemSet, addProblem } from '../API'
import Modal from 'react-modal'
const { isOnlyWhitespace, modalStyle } = require('../helper')

Modal.setAppElement('#root')

export default class ProblemSetPage extends Component {
	constructor(props) {
		super(props)

		this.state = {
			problemSet: {
				name: ''
			},
			newQuestionModalOpen: false,
			newQuestionModalQuestion: '',
			newQuestionModalChoices: ['', ''],
			newQuestionModalCorrect: -1,
			newQuestionModalIsLoading: ''
		}
	}

	async componentDidMount() {
		this.fetchProblemSet()
	}

	fetchProblemSet = async () => {
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
		// TODO: opens modal for editing problem (we're not there yet)
	}

	openNewQuestionModal = () => {
		this.setState({ newQuestionModalOpen: true })
	}

	closeNewQuestionModal = () => {
		this.setState({
			newQuestionModalOpen: false,
			newQuestionModalQuestion: '',
			newQuestionModalCorrect: -1,
			newQuestionModalChoices: ['', '']
		})
	}

	onNewQuestionModalQuestionChange = newQuestionModalQuestion => {
		this.setState({ newQuestionModalQuestion })
	}

	onNewQuestionModalChoiceChange = (i, choice) => {
		let choices = this.state.newQuestionModalChoices.slice()
		choices[i] = choice
		this.setState({ newQuestionModalChoices: choices })
	}

	addChoice = () => {
		let choices = this.state.newQuestionModalChoices.slice()
		choices.push('')
		this.setState({ newQuestionModalChoices: choices })
	}

	addProblem = async () => {
		let question = this.state.newQuestionModalQuestion
		let choices = this.state.newQuestionModalChoices
		let correct = this.state.newQuestionModalCorrect

		this.setState({ newQuestionModalIsLoading: true })

		await addProblem(this.state.problemSet._id, question, choices, correct)

		this.closeNewQuestionModal()
		this.setState({ newQuestionModalIsLoading: false })
		this.fetchProblemSet()
	}

	isValidInput = () => {
		let question = this.state.newQuestionModalQuestion
		let choices = this.state.newQuestionModalChoices
		let correct = this.state.newQuestionModalCorrect

		if (
			[question, ...choices].some(s => isOnlyWhitespace(s)) ||
			this.state.newQuestionModalIsLoading ||
			correct < 0
		)
			return false
		return true
	}

	deleteChoice = i => {
		let choices = this.state.newQuestionModalChoices.slice()
		let correct = this.state.newQuestionModalCorrect
		choices.splice(i, 1)
		if (correct >= choices.length) correct--
		this.setState({
			newQuestionModalChoices: choices,
			newQuestionModalCorrect: correct
		})
	}

	chooseCorrect = i => {
		this.setState({ newQuestionModalCorrect: i })
	}

	render() {
		return (
			<div className="content">
				<Modal
					isOpen={this.state.newQuestionModalOpen}
					onRequestClose={this.closeNewQuestionModal}
					style={modalStyle}
					contentLabel="Add Problem">
					<h3>Add Problem</h3>
					<Textbox
						placeholder="Question"
						className="full-width"
						onTextChange={this.onNewQuestionModalQuestionChange}
						text={this.state.newQuestionModalQuestion}
					/>
					{this.state.newQuestionModalChoices.map((choice, i) => (
						<div>
							<Textbox
								key={i}
								className="full-width "
								placeholder={`Choice ${i + 1}`}
								onTextChange={choice =>
									this.onNewQuestionModalChoiceChange(i, choice)
								}
								text={choice}
								style={{ display: 'inline', width: 'calc(100% - 4rem)' }}
							/>
							<i
								className={`material-icons${
									this.state.newQuestionModalCorrect === i ? ' green' : ''
								}`}
								onClick={() => this.chooseCorrect(i)}>
								check
							</i>
							{this.state.newQuestionModalChoices.length > 2 && (
								<i
									className="material-icons"
									onClick={() => this.deleteChoice(i)}>
									close
								</i>
							)}
						</div>
					))}
					<Button
						text="Add Problem"
						onClick={this.addProblem}
						disabled={!this.isValidInput()}
					/>
					<Button
						text="Add Choice"
						onClick={this.addChoice}
						disabled={this.state.newQuestionModalChoices.length >= 6}
					/>
					<Button text="Cancel" onClick={this.closeNewQuestionModal} />
					{this.state.newQuestionModalIsLoading && (
						<h5 className="">Loading...</h5>
					)}
				</Modal>
				<div className="container-fluid" style={{ padding: 0 }}>
					<div className="row" style={{ margin: 0 }}>
						<h2 className="before-button">{this.state.problemSet.name}</h2>
						<Button text="Add Problem" onClick={this.openNewQuestionModal} />
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
										key={p._id}
										className="class-item"
										onClick={() => this.selectProblem(i)}>
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
