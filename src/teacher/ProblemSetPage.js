import React, { Component } from 'react'
import { Button, Table, Textbox } from '../Components'
import queryString from 'query-string'
import {
	teacherFetchProblemSet,
	addProblem,
	executeProblemSet,
	startNextQuestion
} from '../API'
import Modal from 'react-modal'
const { isOnlyWhitespace, modalStyle } = require('../helper')

Modal.setAppElement('#root')

const letters = ['A', 'B', 'C', 'D', 'E', 'F']
export default class ProblemSetPage extends Component {
	constructor(props) {
		super(props)

		this.state = {
			problemSet: {
				name: '',
				problems: [],
				currentProblem: null
			},
			newQuestionModalOpen: false,
			newQuestionModalQuestion: '',
			newQuestionModalChoices: ['', ''],
			newQuestionModalCorrect: -1,
			newQuestionModalIsLoading: '',
			showingAnswer: false
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

	startProblemSet = async () => {
		let executeProblemSetResponse = await executeProblemSet(
			this.state.problemSet._id
		)
		if (executeProblemSetResponse.status === 200) {
			this.fetchProblemSet()
		}
	}

	proceedQuestion = async () => {
		if (this.state.showingAnswer) {
			let nextQuestionResponse = await startNextQuestion(
				this.state.problemSet.classId
			)
			if (nextQuestionResponse.status === 200) {
				this.setState({ showingAnswer: false })
				this.fetchProblemSet()
			}
		} else {
			this.setState({ showingAnswer: true })
		}
	}

	render() {
		let currentProblem =
			this.state.problemSet.currentProblem !== null
				? this.state.problemSet.problems[this.state.problemSet.currentProblem]
				: null
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
				<div className="container-fluid h-100" style={{ padding: 0 }}>
					<div className="row" style={{ margin: 0 }}>
						<h2 className="before-button">{this.state.problemSet.name}</h2>
						<Button
							text="Add Problem"
							onClick={this.openNewQuestionModal}
							disabled={this.state.problemSet.executionDate}
						/>
					</div>
					<div className="row" style={{ height: 'calc(100% - 3.1875rem)' }}>
						<div className="col-4">
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
												className={
													'class-item' +
													(this.state.problemSet.currentProblem === i
														? ' highlight'
														: '')
												}
												onClick={() => this.selectProblem(i)}>
												<td>{p.question}</td>
											</tr>
										))}
								</tbody>
							</table>
						</div>
						<div className="col-8">
							{/* not yet started */}
							{!this.state.problemSet.executionDate && (
								<div class="v-center-content h-100">
									<Button
										text="Start Problem Set"
										onClick={this.startProblemSet}
									/>
								</div>
							)}

							{/* underway */}
							{this.state.problemSet.executionDate &&
								this.state.problemSet.currentProblem !== null && (
									<div
										className="container-fluid h-100"
										style={{ paddingTop: '1rem' }}>
										<div className="row">
											<h1>{currentProblem.question}</h1>
										</div>
										<div className="row">
											{currentProblem.choices.map((choice, i) => (
												<div
													className={
														'choice col' +
														(this.state.showingAnswer &&
														currentProblem.correct === i
															? ' correct'
															: '')
													}>
													<h3>{letters[i] + '. ' + choice}</h3>
												</div>
											))}
										</div>
										<div className="row">
											<Button
												text={
													this.state.problemSet.currentProblem ===
														this.state.problemSet.problems.length - 1 &&
													this.state.showingAnswer
														? 'Finish'
														: this.state.showingAnswer
														? 'Next Question'
														: 'Show Answer'
												}
												onClick={this.proceedQuestion}
											/>
										</div>
									</div>
								)}

							{/* finished */}
							{this.state.problemSet.executionDate &&
								this.state.problemSet.currentProblem === null && (
									<div>FINISHED</div>
								)}
						</div>
					</div>
				</div>
			</div>
		)
	}
}
