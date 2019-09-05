import React, { Component } from 'react'
import { Button, Textbox } from '../Components'
import queryString from 'query-string'
import { getProblem, answer, studentFetchClass } from '../api/student'
import Modal from 'react-modal'
const { isOnlyWhitespace, modalStyle, letters } = require('../helper')

Modal.setAppElement('#root')

export default class StudentClassPage extends Component {
	constructor(props) {
		super(props)

		this.state = {
			class: {
				name: 'Loading...'
			},
			currentProblem: null,
			selectedAnswer: null,
			correctAnswer: null,
			settingsModalOpen: false,
			settingsModalIsLoading: false
		}
	}

	async componentDidMount() {
		this.fetchClass()
		this.getProblem()
	}

	fetchClass = async () => {
		let { id } = queryString.parse(this.props.location.search)
		let classResponse = await studentFetchClass(id)
		if (classResponse.status !== 200) {
			this.props.history.push('/login')
			return
		}

		let classObj = await classResponse.json()
		this.setState({ class: classObj })
	}

	getProblem = async () => {
		let { id } = queryString.parse(this.props.location.search)
		let problemResponse = await getProblem(id)

		if (problemResponse.status === 200) {
			let problem = await problemResponse.json()
			this.setState({
				currentProblem: problem,
				selectedAnswer: problem.response ? problem.response.response : null,
				correctAnswer: problem.correct !== null ? problem.correct : null
			})
		} else if (problemResponse.status !== 404) this.props.history.push('/login')
	}

	openSettingsModal = () => {
		this.setState({
			settingsModalOpen: true
		})
	}

	closeSettingsModal = () => {
		this.setState({ settingsModalOpen: false })
	}

	leaveClass = async () => {
		// TODO: implement leave class
		// await leaveClass(this.state.class._id)
		// this.closeSettingsModal()
		// this.props.history.push('/student/classes')
	}

	selectAnswer = async i => {
		let { id } = queryString.parse(this.props.location.search)

		if (this.state.correctAnswer === null && this.state.selectedAnswer !== i) {
			let answerResponse = await answer(id, i)

			if (answerResponse.status === 200) this.setState({ selectedAnswer: i })
		}
	}

	render() {
		console.log(this.state)
		return (
			<div className="content">
				{/* Settings modal */}
				<Modal
					isOpen={this.state.settingsModalOpen}
					onRequestClose={this.closeSettingsModal}
					style={modalStyle}
					contentLabel="Class Settings">
					<h3>Class Settings</h3>
					<Button
						text="Leave Class"
						style={{ backgroundColor: '#f95757' }}
						onClick={this.leaveClass}
					/>
					<Button text="Cancel" onClick={this.closeSettingsModal} />
					{this.state.settingsModalIsLoading && <h5>Loading...</h5>}
				</Modal>
				<div className="container-fluid" style={{ padding: 0, height: '100%' }}>
					<div className="row" style={{ margin: 0 }}>
						<h2 className="before-button">{this.state.class.name}</h2>
						<Button
							text="Settings"
							onClick={this.openSettingsModal}
							className="right"
						/>
					</div>
					{this.state.currentProblem ? (
						<div style={{ height: 'calc(100% - 3.1875rem)' }}>
							<div className="row" style={{ margin: 0, marginTop: '1rem' }}>
								<h1>{this.state.currentProblem.question}</h1>
							</div>
							<div className="row">
								{this.state.currentProblem.choices.map((choice, i) => (
									<div
										key={i}
										className={`choice col-md ${
											this.state.correctAnswer === null ? 'clickable' : ''
										} ${this.state.selectedAnswer === i ? 'selected' : ''} ${
											this.state.correctAnswer !== null
												? this.state.correctAnswer === i
													? 'correct'
													: this.state.selectedAnswer === i
													? 'incorrect'
													: ''
												: ''
										}`}
										onClick={() => {
											this.selectAnswer(i)
										}}>
										<h3>{letters[i] + '. ' + choice}</h3>
									</div>
								))}
							</div>
							<div className="row v-center-content">
								Select an answer to the question!
							</div>
						</div>
					) : (
						<div
							className="v-center-content"
							style={{ height: 'calc(100% - 3.1875rem)' }}>
							<h3>Nothing going on in this class right now :)</h3>
						</div>
					)}
				</div>
			</div>
		)
	}
}
