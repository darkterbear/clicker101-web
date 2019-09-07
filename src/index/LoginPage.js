import React, { Component } from 'react'
import { Button, Textbox } from '../Components'
import { authenticate } from '../api/index'

export default class LoginPage extends Component {
	constructor(props) {
		super(props)

		this.state = {
			errorMessage: '',
			isLoading: false,
			email: '',
			password: ''
		}
	}

	login = async () => {
		if (this.state.isLoading) return
		if (!this.state.password || !this.state.email) {
			this.setState({ errorMessage: 'Please input your credentials' })
			return
		}

		this.setState({ errorMessage: '', isLoading: true })
		let { email, password } = this.state

		let loginResponse = await authenticate(email, password)

		let status = loginResponse.status
		if (status === 200) this.props.history.push('/teacher/classes')
		else if (status === 201) this.props.history.push('/student/classes')
		else {
			this.setState({
				errorMessage: 'Email or password is incorrect :(',
				isLoading: false
			})
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
					{this.state.errorMessage && (
						<div className="row justify-content-center">
							<h5 className="error">{this.state.errorMessage}</h5>
						</div>
					)}
					<div className="row justify-content-center">
						<Button text="Log In" onClick={this.login} />
					</div>
				</div>
			</div>
		)
	}
}
