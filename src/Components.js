import React, { Component } from 'react'

export class Button extends Component {
	render() {
		return (
			<button
				class={'normal' + (this.props.disabled ? ' disabled' : '')}
				onClick={this.props.onClick}>
				{this.props.text}
			</button>
		)
	}
}

export class SmallButton extends Component {
	render() {
		return (
			<button
				class={'small' + (this.props.disabled ? ' disabled' : '')}
				onClick={this.props.onClick}>
				{this.props.text}
			</button>
		)
	}
}

export class Textbox extends Component {
	constructor(props) {
		super(props)

		this.state = {
			text: this.props.text || ''
		}
	}

	getText = () => {
		return this.state.text
	}

	render() {
		return (
			<input
				onKeyDown={this.handleKeyDown}
				type={this.props.type}
				className={this.props.className}
				placeholder={this.props.placeholder}
				value={this.state.text}
				onChange={e => {
					this.setState({ text: e.target.value })
					if (this.props.onTextChange) this.props.onTextChange(e.target.value)
				}}
			/>
		)
	}
}
