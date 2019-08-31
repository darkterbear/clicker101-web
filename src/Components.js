import React, { Component } from 'react'

export class Button extends Component {
	render() {
		return <button>{this.props.text}</button>
	}
}
