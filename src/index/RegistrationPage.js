import React, { Component } from 'react'
import { Button, Textbox } from '../Components'
import { isValidEmail, isOnlyWhitespace } from '../helper'
import { register } from '../API'

export default class RegistrationPage extends Component {
	constructor(props) {
		super(props)

		this.state = {
			type: 'student'
		}

		this.emailRef = React.createRef()
		this.nameRef = React.createRef()
		this.passwordRef = React.createRef()
		this.confirmRef = React.createRef()
	}

	render() {
		return (
			<div className="content v-center-content">
				<h2>Clicker101</h2>
				<div className="container">
					<div className="row justify-content-center">
						<h3>Let's get started!</h3>
					</div>
					<div className="row justify-content-center">
						<Textbox
							ref={this.emailRef}
							className="center"
							placeholder={'Email'}
						/>
						<Textbox
							ref={this.nameRef}
							className="center"
							placeholder={'Full Name'}
						/>
					</div>
					<div className="row justify-content-center">
						<Textbox
							ref={this.passwordRef}
							className="center"
							type="password"
							placeholder={'Password'}
						/>
						<Textbox
							ref={this.confirmRef}
							className="center"
							type="password"
							placeholder={'Confirm Password'}
						/>
					</div>
					<div className="row justify-content-center">
						<Button
							text="I'm a Student"
							disabled={this.state.type !== 'student'}
							onClick={() => {
								this.changeType('student')
							}}
						/>
						<Button
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
		let email = this.emailRef.current.getText()
		let name = this.nameRef.current.getText()
		let password = this.passwordRef.current.getText()
		let confirm = this.confirmRef.current.getText()

		if (
			password === confirm &&
			!isOnlyWhitespace(name) &&
			isValidEmail(email) &&
			!isOnlyWhitespace(name)
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
