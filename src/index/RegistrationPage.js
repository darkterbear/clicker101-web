import React, { Component } from 'react'
import { Button, Textbox, LoadingBar } from '../Components'
import { isValidEmail, isOnlyWhitespace } from '../helper'
import { register } from '../api/index'

export default class RegistrationPage extends Component {
	constructor(props) {
		super(props)

		this.state = {
			type: 'student',
			email: '',
			name: '',
			password: '',
			confirm: '',

			isLoading: false,
			errorMessage: ''
		}
	}

	changeType = type => {
		this.setState({ type })
	}

	register = async () => {
		if (this.state.isLoading) return

		let { email, name, password, confirm } = this.state

		if (
			password === confirm &&
			!isOnlyWhitespace(name) &&
			isValidEmail(email) &&
			password.length >= 8
		) {
			this.setState({ errorMessage: false, isLoading: true })
			let registerResponse = await register(
				email,
				name,
				password,
				this.state.type
			)

			if (registerResponse.status === 200) {
				if (this.state.type === 'teacher')
					this.props.history.push('/teacher/classes')
				else this.props.history.push('/student/classes')
			} else
				this.setState({
					isLoading: false,
					errorMessage: 'Something happened :('
				})
		} else
			this.setState({ errorMessage: 'Something is wrong with your input!' })
	}

	render() {
		return (
			<div className="content v-center-content">
				<LoadingBar show={this.state.isLoading} />
				<h2 className="top-left-absolute">Clicker101</h2>
				<div className="container">
					<div className="row justify-content-center">
						<h3>Let's get started!</h3>
					</div>
					<div className="row justify-content-center">
						<Textbox
							className="center"
							placeholder={'Email'}
							onTextChange={t => this.setState({ email: t })}
						/>
						<Textbox
							className="center"
							placeholder={'Full Name'}
							onTextChange={t => this.setState({ name: t })}
						/>
					</div>
					<div className="row justify-content-center">
						<Textbox
							className="center"
							type="password"
							placeholder={'Password'}
							onTextChange={t => this.setState({ password: t })}
						/>
						<Textbox
							className="center"
							type="password"
							placeholder={'Confirm Password'}
							onTextChange={t => this.setState({ confirm: t })}
						/>
					</div>
					<div className="row justify-content-center">
						<Button
							enableClickWhenDisabled={true}
							text="I'm a Student"
							disabled={this.state.type !== 'student'}
							onClick={() => {
								this.changeType('student')
							}}
						/>
						<Button
							enableClickWhenDisabled={true}
							text="I'm a Teacher"
							disabled={this.state.type !== 'teacher'}
							onClick={() => {
								this.changeType('teacher')
							}}
						/>
					</div>
					<div className="row justify-content-center">
						<Button text="Get Started" onClick={this.register} />
					</div>
					{this.state.errorMessage && (
						<div className="row justify-content-center">
							<h5 className="error">{this.state.errorMessage}</h5>
						</div>
					)}
				</div>
			</div>
		)
	}
}
