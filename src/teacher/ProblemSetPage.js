import React, { Component } from 'react'
import { Button, Textbox, SmallButton } from '../Components'
import queryString from 'query-string'
import {
	teacherFetchProblemSet,
	addProblem,
	executeProblemSet,
	startNextProblem,
	stopThisProblem,
	editProblemSetName,
	deleteProblemSet,
	deleteProblem,
	editProblem
} from '../api/teacher'
import Modal from 'react-modal'
import { Bar } from 'react-chartjs-2'
import { logout } from '../api'
const { isOnlyWhitespace, modalStyle, letters } = require('../helper')

Modal.setAppElement('#root')

export default class ProblemSetPage extends Component {
	constructor(props) {
		super(props)

		this.state = {
			problemSet: {
				name: 'Loading...',
				problems: [],
				currentProblem: null,
				executionDate: true
			},

			// execution
			showingAnswer: false,

			// new problem
			newProblemModalOpen: false,
			newProblemModalQuestion: '',
			newProblemModalChoices: ['', ''],
			newProblemModalCorrect: -1,
			newProblemModalIsLoading: '',

			// settings
			settingsModalOpen: false,
			settingsModalName: '',
			settingsModalIsLoading: false,

			// problem selection for editing and viewing
			selectedProblem: -1,
			selectedProblemEditQuestion: '',
			selectedProblemEditChoices: [],
			selectedProblemEditCorrect: -1,
			editingIsLoading: false
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

		// if problem has stopped, show answer
		if (problemSet.currentProblem % 1 !== 0)
			this.setState({ showingAnswer: true })
	}

	selectProblem = i => {
		// if same problem is selected, set selected to none
		if (this.state.selectedProblem === i)
			this.setState({
				selectedProblem: -1,
				selectedProblemEditQuestion: '',
				selectedProblemEditChoices: [],
				selectedProblemEditCorrect: -1
			})
		else {
			let problem = this.state.problemSet.problems[i]
			let selectedProblemEditQuestion = problem.question
			let selectedProblemEditChoices = problem.choices
			let selectedProblemEditCorrect = problem.correct
			this.setState({
				selectedProblem: i,
				selectedProblemEditQuestion,
				selectedProblemEditChoices,
				selectedProblemEditCorrect
			})
		}
	}

	isValidInput = (question, choices, correct, isLoading) => {
		if (
			[question, ...choices].some(s => isOnlyWhitespace(s)) ||
			isLoading ||
			correct < 0
		)
			return false
		return true
	}

	// new problem modal control
	openNewProblemModal = () => {
		this.setState({ newProblemModalOpen: true })
	}

	closeNewProblemModal = () => {
		this.setState({
			newProblemModalOpen: false,
			newProblemModalQuestion: '',
			newProblemModalCorrect: -1,
			newProblemModalChoices: ['', '']
		})
	}

	onNewProblemModalChoiceChange = (i, choice) => {
		let choices = this.state.newProblemModalChoices.slice()
		choices[i] = choice
		this.setState({ newProblemModalChoices: choices })
	}

	onNewProblemModalQuestionChange = newProblemModalQuestion => {
		this.setState({ newProblemModalQuestion })
	}

	newProblemAddChoice = () => {
		let choices = this.state.newProblemModalChoices.slice()
		choices.push('')
		this.setState({ newProblemModalChoices: choices })
	}

	newProblemDeleteChoice = i => {
		let hasSelectedCorrect = this.state.newProblemModalCorrect >= 0
		let choices = this.state.newProblemModalChoices.slice()
		let correct = this.state.newProblemModalCorrect - 1
		choices.splice(i, 1)
		if (correct < 0 && hasSelectedCorrect) correct = 0
		this.setState({
			newProblemModalChoices: choices,
			newProblemModalCorrect: correct
		})
	}

	newProblemChooseCorrect = i => {
		this.setState({ newProblemModalCorrect: i })
	}

	addProblem = async () => {
		let question = this.state.newProblemModalQuestion
		let choices = this.state.newProblemModalChoices
		let correct = this.state.newProblemModalCorrect
		if (
			!this.isValidInput(
				question,
				choices,
				correct,
				this.state.newProblemModalIsLoading
			)
		)
			return

		this.setState({ newProblemModalIsLoading: true })

		await addProblem(this.state.problemSet._id, question, choices, correct)

		this.closeNewProblemModal()
		this.setState({ newProblemModalIsLoading: false })
		this.fetchProblemSet()
	}

	// edit problem modal control
	onEditQuestionChange = selectedProblemEditQuestion => {
		this.setState({ selectedProblemEditQuestion })
	}

	onEditChoiceChange = (i, choice) => {
		let choices = this.state.selectedProblemEditChoices.slice()
		choices[i] = choice
		this.setState({ selectedProblemEditChoices: choices })
	}

	editAddChoice = () => {
		let choices = this.state.selectedProblemEditChoices.slice()
		choices.push('')
		this.setState({ selectedProblemEditChoices: choices })
	}

	editDeleteChoice = i => {
		let hasSelectedCorrect = this.state.selectedProblemEditCorrect >= 0
		let choices = this.state.selectedProblemEditChoices.slice()
		let correct = this.state.selectedProblemEditCorrect - 1
		choices.splice(i, 1)
		if (correct < 0 && hasSelectedCorrect) correct = 0
		this.setState({
			selectedProblemEditChoices: choices,
			selectedProblemEditCorrect: correct
		})
	}

	editChooseCorrect = i => {
		this.setState({ selectedProblemEditCorrect: i })
	}

	deleteProblem = async () => {
		await deleteProblem(this.state.problemSet._id, this.state.selectedProblem)
		this.setState(
			{
				selectedProblem: -1,
				selectedProblemEditQuestion: '',
				selectedProblemEditChoices: [],
				selectedProblemEditCorrect: -1
			},
			() => this.fetchProblemSet()
		)
	}

	saveEditProblem = async () => {
		let question = this.state.selectedProblemEditQuestion
		let choices = this.state.selectedProblemEditChoices
		let correct = this.state.selectedProblemEditCorrect

		if (
			!this.isValidInput(
				question,
				choices,
				correct,
				this.state.editingIsLoading
			)
		)
			return

		this.setState({ editingIsLoading: true })

		await editProblem(
			this.state.problemSet._id,
			this.state.selectedProblem,
			question,
			choices,
			correct
		)

		this.setState({ editingIsLoading: false })
		this.fetchProblemSet()
	}

	// settings modal control
	openSettingsModal = () => {
		this.setState({
			settingsModalOpen: true,
			settingsModalName: this.state.problemSet.name
		})
	}

	closeSettingsModal = () => {
		this.setState({ settingsModalOpen: false, settingsModalName: '' })
	}

	onSettingsModalNameChange = settingsModalName => {
		this.setState({ settingsModalName })
	}

	editProblemSetName = async () => {
		let newName = this.state.settingsModalName

		if (
			isOnlyWhitespace(newName) ||
			this.state.settingsModalIsLoading ||
			newName === this.state.problemSet.name
		)
			return

		this.setState({ settingsModalIsLoading: true })

		await editProblemSetName(newName, this.state.problemSet._id)

		this.closeSettingsModal()
		this.setState({ settingsModalIsLoading: false })
		this.fetchProblemSet()
	}

	deleteProblemSet = async () => {
		await deleteProblemSet(this.state.problemSet._id)
		this.closeSettingsModal()
		this.props.history.push(
			'/teacher/class?id=' + this.state.problemSet.classId
		)
	}

	// execution control
	startProblemSet = async () => {
		let executeProblemSetResponse = await executeProblemSet(
			this.state.problemSet._id
		)
		if (executeProblemSetResponse.status === 200) {
			this.fetchProblemSet()
		}
	}

	proceedProblem = async () => {
		let proceedFunction = this.state.showingAnswer
			? startNextProblem
			: stopThisProblem
		let showingAnswer = this.state.showingAnswer ? false : true

		let proceedResponse = await proceedFunction(this.state.problemSet.classId)

		if (proceedResponse.status === 200) {
			this.setState({ showingAnswer })
			this.fetchProblemSet()
		}
	}

	logout = async () => {
		await logout()
		this.props.history.push('/login')
	}

	render() {
		let currentProblem, problemData, selectedProblem, resultData

		// execution, current problem
		if (this.state.problemSet.currentProblem !== null) {
			// general
			currentProblem = this.state.problemSet.problems[
				Math.floor(this.state.problemSet.currentProblem)
			]

			// immediate results
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

		// editing and viewing, selected problem
		if (
			this.state.selectedProblem >= 0 &&
			this.state.selectedProblem < this.state.problemSet.problems.length
		) {
			// general
			selectedProblem = this.state.problemSet.problems[
				this.state.selectedProblem
			]

			// viewing results
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
				{/* New problem modal */}
				<Modal
					isOpen={this.state.newProblemModalOpen}
					onRequestClose={this.closeNewProblemModal}
					style={modalStyle}
					contentLabel="New Problem">
					<h3>New Problem</h3>
					<Textbox
						placeholder="Question"
						className="full-width"
						onTextChange={this.onNewProblemModalQuestionChange}
					/>
					{this.state.newProblemModalChoices.map((choice, i) => (
						<div key={i}>
							<Textbox
								className="full-width choice-edit"
								placeholder={`Choice ${i + 1}`}
								onTextChange={choice =>
									this.onNewProblemModalChoiceChange(i, choice)
								}
								text={choice}
							/>
							<i
								className={`material-icons${
									this.state.newProblemModalCorrect === i ? ' green' : ''
								}`}
								onClick={() => this.newProblemChooseCorrect(i)}>
								check
							</i>
							{this.state.newProblemModalChoices.length > 2 && (
								<i
									className="material-icons"
									onClick={() => this.newProblemDeleteChoice(i)}>
									close
								</i>
							)}
						</div>
					))}
					<Button
						text="Save"
						onClick={this.addProblem}
						disabled={
							!this.isValidInput(
								this.state.newProblemModalQuestion,
								this.state.newProblemModalChoices,
								this.state.newProblemModalCorrect,
								this.state.newProblemModalIsLoading
							)
						}
					/>
					<Button
						text="Add Choice"
						onClick={this.newProblemAddChoice}
						disabled={this.state.newProblemModalChoices.length >= 6}
					/>
					<Button text="Cancel" onClick={this.closeNewProblemModal} />
					{this.state.newProblemModalIsLoading && <h5>Loading...</h5>}
				</Modal>

				{/* Settings modal */}
				<Modal
					isOpen={this.state.settingsModalOpen}
					onRequestClose={this.closeSettingsModal}
					style={modalStyle}
					contentLabel="Problem Set Settings">
					<h3>Problem Set Settings</h3>
					<Textbox
						placeholder="Problem Set Name"
						className="full-width"
						text={this.state.settingsModalName}
						onTextChange={this.onSettingsModalNameChange}
						onEnter={this.editProblemSetName}
					/>
					<Button
						text="Save"
						onClick={this.editProblemSetName}
						disabled={isOnlyWhitespace(this.state.settingsModalName)}
					/>
					<Button
						text="Delete Problem Set"
						warning={true}
						onClick={this.deleteProblemSet}
					/>
					<Button text="Cancel" onClick={this.closeSettingsModal} />
					{this.state.settingsModalIsLoading && <h5>Loading...</h5>}
				</Modal>
				<div className="container-fluid h-100">
					<div className="row">
						<h2 className="before-button">{this.state.problemSet.name}</h2>

						{/* Display Add Problem button if set hasn't been executed */}
						{!this.state.problemSet.executionDate && (
							<Button text="New Problem" onClick={this.openNewProblemModal} />
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
						<SmallButton
							text="Settings"
							onClick={this.openSettingsModal}
							className="right"
						/>
						<SmallButton text="Log Out" onClick={this.logout} />
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
							{!this.state.problemSet.executionDate && (
								<div className="v-center-content h-100 full-width">
									{selectedProblem && (
										<div className="h-100 full-width">
											<div className="row">
												<h3 className="before-button">
													Editing Problem {this.state.selectedProblem + 1}
												</h3>
												<Button
													text="Add Choice"
													onClick={this.editAddChoice}
													disabled={
														this.state.selectedProblemEditChoices.length >= 6
													}
												/>
												<Button
													text="Save"
													className="right"
													onClick={this.saveEditProblem}
													disabled={
														!this.isValidInput(
															this.state.selectedProblemEditQuestion,
															this.state.selectedProblemEditChoices,
															this.state.selectedProblemEditCorrect,
															this.state.editingIsLoading
														)
													}
												/>
												<Button
													text="Delete"
													warning={true}
													onClick={this.deleteProblem}
												/>
											</div>
											<Textbox
												className="full-width"
												text={this.state.selectedProblemEditQuestion}
												onTextChange={question => {
													this.onEditQuestionChange(question)
												}}
												placeholder="Question"
											/>
											{this.state.selectedProblemEditChoices.map(
												(choice, i) => (
													<div key={i}>
														<Textbox
															className="full-width choice-edit"
															placeholder={`Choice ${i + 1}`}
															onTextChange={choice => {
																this.onEditChoiceChange(i, choice)
															}}
															text={choice}
														/>
														<i
															className={`material-icons${
																this.state.selectedProblemEditCorrect === i
																	? ' green'
																	: ''
															}`}
															onClick={() => {
																this.editChooseCorrect(i)
															}}>
															check
														</i>
														{this.state.selectedProblemEditChoices.length >
															2 && (
															<i
																className="material-icons"
																onClick={() => {
																	this.editDeleteChoice(i)
																}}>
																close
															</i>
														)}
													</div>
												)
											)}
											{this.state.editingIsLoading && <h5>Loading...</h5>}
										</div>
									)}
									{this.state.selectedProblem < 0 && (
										<h3>Click on a problem to inspect and edit!</h3>
									)}
								</div>
							)}

							{/* Display problems and choices when underway */}
							{currentProblem && (
								<div
									className="container-fluid h-100"
									style={{ paddingTop: '1rem' }}>
									<div className="row">
										<h1>{currentProblem.question}</h1>
									</div>
									<div className="row">
										{currentProblem.choices.map((choice, i) => (
											<div
												key={i}
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
								this.state.problemSet._id &&
								!currentProblem && (
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
