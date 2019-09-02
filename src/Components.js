import React, { Component } from 'react'

export class Button extends Component {
	onClick = () => {
		if (!this.props.disabled || this.props.enableClickWhenDisabled)
			this.props.onClick()
	}

	render() {
		return (
			<button
				className={'normal' + (this.props.disabled ? ' disabled' : '')}
				onClick={this.onClick}>
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

	clear = () => {
		this.setState({ text: '' })
	}

	handleKeyDown = e => {
		if (e.key === 'Enter') {
			if (this.props.onEnter) this.props.onEnter()
		}

		if (e.key === 'Tab') {
			if (this.props.onTab) this.props.onTab()
		}

		if (e.key === 'ArrowDown') {
			if (this.props.onArrowDown) this.props.onArrowDown()
		}

		if (e.key === 'ArrowUp') {
			if (this.props.onArrowUp) this.props.onArrowUp()
		}
	}

	componentWillReceiveProps(newProps) {
		this.setState({ text: newProps.text })
	}

	render() {
		return (
			<input
				style={this.props.style}
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
