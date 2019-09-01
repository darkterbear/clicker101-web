import React, { Component } from 'react'
import { Button, SmallButton } from '../Components'
import { authenticate } from '../API'

export default class SplashPage extends Component {
	render() {
		return (
			<div className="content v-center-content">
				<h2>Clicker101</h2>
				<div className="container">
					<div className="row justify-content-center">
						<h3>Measuring student learning accessibly and insightfully.</h3>
					</div>
					<div className="row justify-content-center pad-top">
						<Button text="Get Started" onClick={this.getStarted} />
					</div>
					<div className="row justify-content-center pad-top">
						<SmallButton text="I have an account" onClick={this.login} />
					</div>
				</div>
			</div>
		)
	}

	getStarted = () => {
		this.props.history.push('/register')
	}

	login = async () => {
		let authResponse = await authenticate()
		if (authResponse.status === 200) this.props.history.push('/teacher/classes')
		else if (authResponse.status === 201)
			this.props.history.push('/student/classes')
		else this.props.history.push('/login')
	}
}
