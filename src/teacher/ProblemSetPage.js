import React, { Component } from 'react'
import { Button, Textbox } from '../Components'
import queryString from 'query-string'
import {
	teacherFetchProblemSet,
	addProblem,
	executeProblemSet,
	startNextProblem,
	stopThisProblem
} from '../API'
import Modal from 'react-modal'
import { Bar } from 'react-chartjs-2'
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
				currentProblem: null,
				executionDate: true
			},
			newProblemModalOpen: false,
			newProblemModalProblem: '',
			newProblemModalChoices: ['', ''],
			newProblemModalCorrect: -1,
			newProblemModalIsLoading: '',
			showingAnswer: false,
			selectedProblem: -1,
			editingProblem: -1
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

		if (problemSet.currentProblem % 1 !== 0)
			this.setState({ showingAnswer: true })

		console.log(this.state.problemSet)
	}

	selectProblem = i => {
		if (this.state.selectedProblem === i) this.setState({ selectedProblem: -1 })
		else this.setState({ selectedProblem: i })
	}

	openNewProblemModal = () => {
		this.setState({ newProblemModalOpen: true })
	}

	closeNewProblemModal = () => {
		this.setState({
			newProblemModalOpen: false,
			newProblemModalProblem: '',
			newProblemModalCorrect: -1,
			newProblemModalChoices: ['', '']
		})
	}

	onNewProblemModalProblemChange = newProblemModalProblem => {
		this.setState({ newProblemModalProblem })
	}

	onNewProblemModalChoiceChange = (i, choice) => {
		let choices = this.state.newProblemModalChoices.slice()
		choices[i] = choice
		this.setState({ newProblemModalChoices: choices })
	}

	addChoice = () => {
		let choices = this.state.newProblemModalChoices.slice()
		choices.push('')
		this.setState({ newProblemModalChoices: choices })
	}

	addProblem = async () => {
		let problem = this.state.newProblemModalProblem
		let choices = this.state.newProblemModalChoices
		let correct = this.state.newProblemModalCorrect

		this.setState({ newProblemModalIsLoading: true })

		await addProblem(this.state.problemSet._id, problem, choices, correct)

		this.closeNewProblemModal()
		this.setState({ newProblemModalIsLoading: false })
		this.fetchProblemSet()
	}

	isValidInput = () => {
		let problem = this.state.newProblemModalProblem
		let choices = this.state.newProblemModalChoices
		let correct = this.state.newProblemModalCorrect

		if (
			[problem, ...choices].some(s => isOnlyWhitespace(s)) ||
			this.state.newProblemModalIsLoading ||
			correct < 0
		)
			return false
		return true
	}

	deleteChoice = i => {
		let choices = this.state.newProblemModalChoices.slice()
		let correct = this.state.newProblemModalCorrect
		choices.splice(i, 1)
		if (correct >= choices.length) correct--
		this.setState({
			newProblemModalChoices: choices,
			newProblemModalCorrect: correct
		})
	}

	chooseCorrect = i => {
		this.setState({ newProblemModalCorrect: i })
	}

	startProblemSet = async () => {
		let executeProblemSetResponse = await executeProblemSet(
			this.state.problemSet._id
		)
		if (executeProblemSetResponse.status === 200) {
			this.fetchProblemSet()
		}
	}

	proceedProblem = async () => {
		if (this.state.showingAnswer) {
			let nextProblemResponse = await startNextProblem(
				this.state.problemSet.classId
			)
			if (nextProblemResponse.status === 200) {
				this.setState({ showingAnswer: false })
				this.fetchProblemSet()
			}
		} else {
			let stopProblemResponse = await stopThisProblem(
				this.state.problemSet.classId
			)

			if (
				stopProblemResponse.status === 200 ||
				stopProblemResponse.status === 201
			) {
				this.setState({ showingAnswer: true })
				this.fetchProblemSet()
			}
		}
	}

	render() {
		let currentProblem, problemData, resultData

		if (this.state.problemSet.currentProblem !== null) {
			currentProblem = this.state.problemSet.problems[
				Math.floor(this.state.problemSet.currentProblem)
			]

			let backgroundColor = Array.from(
				{ length: currentProblem.choices.length },
				() => 'rgba(255, 99, 132, 0.2)'
			)
			backgroundColor[currentProblem.correct] = '#20df8f88'

			problemData = {
				labels: letters.slice(0, currentProblem.choices.length),
				datasets: [
					{
						data: currentProblem.choices.map((_, i) => {
							return currentProblem.responses.filter(res => res.response === i)
								.length
						}),
						backgroundColor,
						borderWidth: 4
					}
				]
			}
		}

		if (this.state.selectedProblem >= 0) {
			let selectedProblem = this.state.problemSet.problems[
				this.state.selectedProblem
			]

			let backgroundColor = Array.from(
				{ length: selectedProblem.choices.length },
				() => 'rgba(255, 99, 132, 0.2)'
			)
			backgroundColor[selectedProblem.correct] = '#20df8f88'

			resultData = {
				labels: letters.slice(0, selectedProblem.choices.length),
				datasets: [
					{
						data: selectedProblem.choices.map((_, i) => {
							return selectedProblem.responses.filter(res => res.response === i)
								.length
						}),
						backgroundColor,
						borderWidth: 4
					}
				]
			}
		}

		let questions =
			this.state.problemSet.problems &&
			this.state.problemSet.problems.map((p, i) => (
				<tr
					key={p._id}
					className={
						'class-item' +
						((this.state.problemSet.currentProblem !== null &&
							Math.floor(this.state.problemSet.currentProblem) === i) ||
						this.state.selectedProblem === i
							? ' highlight'
							: '')
					}
					onClick={() => this.selectProblem(i)}>
					<td>{p.question}</td>
				</tr>
			))

		let problemChart = (
			<Bar
				data={problemData}
				options={{
					legend: false,
					tooltips: false,
					scales: {
						yAxes: [
							{
								ticks: {
									beginAtZero: true,
									stepSize: 1
								}
							}
						]
					}
				}}
			/>
		)

		let resultsChart = (
			<Bar
				data={resultData}
				options={{
					legend: false,
					tooltips: false,
					title: {
						display: true,
						text: `Problem ${this.state.selectedProblem + 1} Results`,
						fontSize: 24
					},
					scales: {
						yAxes: [
							{
								ticks: {
									beginAtZero: true,
									stepSize: 1
								}
							}
						]
					}
				}}
			/>
		)

		return (
			<div className="content">
				<Modal
					isOpen={this.state.newProblemModalOpen}
					onRequestClose={this.closeNewProblemModal}
					style={modalStyle}
					contentLabel="Add Problem">
					<h3>Add Problem</h3>
					<Textbox
						placeholder="Question"
						className="full-width"
						onTextChange={this.onNewProblemModalProblemChange}
					/>
					{this.state.newProblemModalChoices.map((choice, i) => (
						<div key={i}>
							<Textbox
								className="full-width "
								placeholder={`Choice ${i + 1}`}
								onTextChange={choice =>
									this.onNewProblemModalChoiceChange(i, choice)
								}
								style={{ display: 'inline', width: 'calc(100% - 4rem)' }}
							/>
							<i
								className={`material-icons${
									this.state.newProblemModalCorrect === i ? ' green' : ''
								}`}
								onClick={() => this.chooseCorrect(i)}>
								check
							</i>
							{this.state.newProblemModalChoices.length > 2 && (
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
						disabled={this.state.newProblemModalChoices.length >= 6}
					/>
					<Button text="Cancel" onClick={this.closeNewProblemModal} />
					{this.state.newProblemModalIsLoading && (
						<h5 className="">Loading...</h5>
					)}
				</Modal>
				<div className="container-fluid h-100" style={{ padding: 0 }}>
					<div className="row" style={{ margin: 0 }}>
						<h2 className="before-button">{this.state.problemSet.name}</h2>

						{/* Display Add Problem button if set hasn't been executed */}
						{!this.state.problemSet.executionDate && (
							<Button text="Add Problem" onClick={this.openNewProblemModal} />
						)}

						{/* Display Start Problem Set button if set hasn't been executed */}
						{!this.state.problemSet.executionDate && (
							<Button text="Start Problem Set" onClick={this.startProblemSet} />
						)}

						{/* Display Next Problem, Show Answer, and Finish buttons if set is underway */}
						{this.state.problemSet.executionDate &&
							this.state.problemSet.currentProblem !== null && (
								<Button
									text={
										Math.floor(this.state.problemSet.currentProblem) ===
											this.state.problemSet.problems.length - 1 &&
										this.state.showingAnswer
											? 'Finish'
											: this.state.showingAnswer
											? 'Next Problem'
											: 'Show Answer'
									}
									onClick={this.proceedProblem}
								/>
							)}
					</div>
					<div className="row" style={{ height: 'calc(100% - 3.1875rem)' }}>
						<div className="col-4">
							<table className="table">
								<thead>
									<tr>
										<th>Question</th>
									</tr>
								</thead>
								<tbody>{questions}</tbody>
							</table>
						</div>
						<div className="col-8">
							{/* Display editing panel when not yet started */}
							{!this.state.problemSet.executionDate &&
								this.state.problemSet.currentProblem === null && (
									<div className="v-center-content h-100">
										{this.state.editingProblem >= 0 && <div />}
										{this.state.editingProblem < 0 && (
											<h3>Click on a problem to inspect and edit!</h3>
										)}
									</div>
								)}

							{/* Display problems and choices when underway */}
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
														'choice col-md' +
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
											{this.state.showingAnswer && problemChart}
										</div>
									</div>
								)}

							{/* Display analytics and results when finished */}
							{this.state.problemSet.executionDate &&
								this.state.problemSet.currentProblem === null && (
									<div className="v-center-content h-100">
										{this.state.selectedProblem >= 0 && resultsChart}
										{this.state.selectedProblem < 0 && (
											<h3>Click on a problem to see results</h3>
										)}
									</div>
								)}
						</div>
					</div>
				</div>
			</div>
		)
	}
}
