import React, { Component } from 'react'
import { Button } from '../Components'

export default class LostPage extends Component {
	goToHome = () => {
		this.props.history.push('/')
	}

	render() {
		return (
			<div className="content v-center-content">
				<h2 className="top-left-absolute">Clicker101</h2>
				<div className="container">
					<div className="row justify-content-center">
						<h3>Go home, you're lost :)</h3>
					</div>
					<div className="row justify-content-center pad-top">
						<Button text="Back to Home" onClick={this.goToHome} />
					</div>
				</div>
			</div>
		)
	}
}
