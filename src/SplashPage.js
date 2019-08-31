import React, { Component } from 'react'
import { Button } from './Components'

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
						<Button text="Get Started" />
					</div>
				</div>
			</div>
		)
	}
}
