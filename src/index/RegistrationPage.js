import React, { Component } from 'react'
import { Button, Textbox } from '../Components'
import { isValidEmail, isOnlyWhitespace } from '../helper'
import { register } from '../API'

export default class RegistrationPage extends Component {
	constructor(props) {
		super(props)

		this.state = {
			type: 'student',
			email: '',
			name: '',
			password: '',
			confirm: ''
		}
	}

	render() {
		return (
			<div className="content v-center-content">
				<h2 className="top-left-absolute">Clicker101</h2>
				<div className="container">
					<div className="row justify-content-center">
						<h3>Let's get started!</h3>
					</div>
					<div className="row justify-content-center">
						<Textbox
							className="center"
							placeholder={'Email'}
							text={this.state.email}
							onTextChange={t => this.setState({ email: t })}
						/>
						<Textbox
							className="center"
							placeholder={'Full Name'}
							text={this.state.name}
							onTextChange={t => this.setState({ name: t })}
						/>
					</div>
					<div className="row justify-content-center">
						<Textbox
							className="center"
							type="password"
							placeholder={'Password'}
							text={this.state.password}
							onTextChange={t => this.setState({ password: t })}
						/>
						<Textbox
							className="center"
							type="password"
							placeholder={'Confirm Password'}
							text={this.state.confirm}
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
				</div>
			</div>
		)
	}

	changeType = type => {
		this.setState({ type })
	}

	register = async () => {
		let { email, name, password, confirm } = this.state

		console.log(email)
		console.log(name)
		console.log(password)
		console.log(confirm)
		if (
			password === confirm &&
			!isOnlyWhitespace(name) &&
			isValidEmail(email) &&
			password.length >= 8
		) {
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
			}
		}
	}
}
