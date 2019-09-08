import React, { Component } from 'react'
import { Button, SmallButton, Spinner, LoadingBar } from '../Components'
import queryString from 'query-string'
import {
	getProblem,
	answer,
	studentFetchClass,
	leaveClass
} from '../api/student'
import Sockets from '../api/sockets'
import Modal from 'react-modal'
import { logout } from '../api'
const { modalStyle, letters } = require('../helper')

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
		Sockets.subscribeToProgress(classId => {
			if (classId.toString() === this.state.class._id.toString())
				this.getProblem()
		})
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
		} else if (problemResponse.status === 404) {
			this.setState({
				currentProblem: null,
				selectedAnswer: null,
				correctAnswer: null
			})
		} else this.props.history.push('/login')
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
		await leaveClass(this.state.class._id)
		this.closeSettingsModal()
		this.props.history.push('/student/classes')
	}

	selectAnswer = async i => {
		let { id } = queryString.parse(this.props.location.search)

		if (this.state.correctAnswer === null && this.state.selectedAnswer !== i) {
			let answerResponse = await answer(id, i)

			if (answerResponse.status === 200) this.setState({ selectedAnswer: i })
		}
	}

	logout = async () => {
		await logout()
		this.props.history.push('/login')
	}

	render() {
		console.log(this.state)
		return (
			<div className="content">
				<LoadingBar show={this.settingsModalIsLoading} />
				{/* Settings modal */}
				<Modal
					isOpen={this.state.settingsModalOpen}
					onRequestClose={this.closeSettingsModal}
					style={modalStyle}
					contentLabel="Class Settings">
					<h3>Class Settings</h3>
					<Button text="Leave Class" warning={true} onClick={this.leaveClass} />
					<Button text="Cancel" onClick={this.closeSettingsModal} />
					{this.state.settingsModalIsLoading && <h5>Loading...</h5>}
				</Modal>
				<div className="container-fluid h-100">
					<div className="row">
						<h2 className="before-button">{this.state.class.name}</h2>
						<SmallButton
							text="Settings"
							onClick={this.openSettingsModal}
							className="right"
						/>
						<SmallButton text="Log Out" onClick={this.logout} />
					</div>
					{this.state.currentProblem ? (
						<div>
							<div className="row">
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
							{this.state.selectedAnswer === null &&
								this.state.correctAnswer === null && (
									<div className="row v-center-content">
										Select an answer to the question!
									</div>
								)}

							{this.state.selectedAnswer !== null &&
								this.state.correctAnswer === null && (
									<div className="row v-center-content">
										You can change your answer if you'd like
									</div>
								)}

							{this.state.correctAnswer !== null && (
								<div className="row v-center-content">
									Hang tight for the next question!
								</div>
							)}
						</div>
					) : (
						<div
							className="v-center-content"
							style={{ height: 'calc(100% - 3.1875rem)' }}>
							<h3>Nothing going on in this class right now :)</h3>
							<Spinner show={true} />
						</div>
					)}
				</div>
			</div>
		)
	}
}
