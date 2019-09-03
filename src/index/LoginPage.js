import React, { Component } from 'react'
import { Button, Textbox } from '../Components'
import { authenticate } from '../API'

export default class LoginPage extends Component {
	constructor(props) {
		super(props)

		this.state = {
			loginFailed: false,
			email: '',
			password: ''
		}
	}

	render() {
		return (
			<div className="content v-center-content">
				<h2 className="top-left-absolute">Clicker101</h2>
				<div className="container">
					<div className="row justify-content-center">
						<h3>Welcome back!</h3>
					</div>
					<div className="row justify-content-center">
						<Textbox
							onEnter={this.login}
							className="center"
							placeholder={'Email'}
							onTextChange={t => this.setState({ email: t })}
						/>
					</div>
					<div className="row justify-content-center">
						<Textbox
							onEnter={this.login}
							type="password"
							className="center"
							placeholder={'Password'}
							onTextChange={t => this.setState({ password: t })}
						/>
					</div>
					{this.state.loginFailed && (
						<div className="row justify-content-center">
							<h5 className="error">Incorrect email or password :(</h5>
						</div>
					)}
					<div className="row justify-content-center">
						<Button text="Log In" onClick={this.login} />
					</div>
				</div>
			</div>
		)
	}

	login = async () => {
		this.setState({ loginFailed: false })
		let { email, password } = this.state
		let loginResponse = await authenticate(email, password)

		let status = loginResponse.status
		if (status === 200) this.props.history.push('/teacher/classes')
		else if (status === 201) this.props.history.push('/student/classes')
		else {
			this.setState({ loginFailed: true })
			this.emailRef.current.clear()
			this.passwordRef.current.clear()
		}
	}
}
