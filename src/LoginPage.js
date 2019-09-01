import React, { Component } from 'react'
import { Button, Textbox } from './Components'
import { login } from './API'

export default class LoginPage extends Component {
	constructor(props) {
		super(props)

		this.emailRef = React.createRef()
		this.passwordRef = React.createRef()
	}

	render() {
		return (
			<div className="content v-center-content">
				<h2>Clicker101</h2>
				<div className="container">
					<div className="row justify-content-center">
						<h3>Welcome back!</h3>
					</div>
					<div className="row justify-content-center pad-top">
						<Textbox
							ref={this.emailRef}
							className="center"
							placeholder={'Email'}
						/>
					</div>
					<div className="row justify-content-center pad-top-small">
						<Textbox
							ref={this.passwordRef}
							type="password"
							className="center"
							placeholder={'Password'}
						/>
					</div>
					<div className="row justify-content-center pad-top">
						<Button text="Log In" onClick={this.login} />
					</div>
				</div>
			</div>
		)
	}

	login = async () => {
		let email = this.emailRef.current.getText()
		let password = this.passwordRef.current.getText()
		let loginResponse = await login(email, password)

		let status = loginResponse.status
		if (status === 200 || status === 204)
			this.props.history.push('/teacher/classes')
		else if (status === 201 || status === 205)
			this.props.history.push('/student/classes')
	}
}
