import React, { Component } from 'react'
import { Button, SmallButton } from './Components'

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

	login = () => {
		this.props.history.push('/login')
	}
}
