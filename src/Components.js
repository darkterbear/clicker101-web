import React, { Component } from 'react'

export class Button extends Component {
	onClick = () => {
		if (
			this.props.onClick &&
			(!this.props.disabled || this.props.enableClickWhenDisabled)
		)
			this.props.onClick()
	}

	render() {
		return (
			<button
				className={`${this.props.className} normal ${
					this.props.disabled ? 'disabled' : ''
				}`}
				onClick={this.onClick}
				style={this.props.style}>
				{this.props.text}
			</button>
		)
	}
}

export class SmallButton extends Component {
	render() {
		return (
			<button
				className={`${this.props.className} small ${
					this.props.disabled ? 'disabled' : ''
				}`}
				onClick={this.props.onClick}
				style={this.props.style}>
				{this.props.text}
			</button>
		)
	}
}

export class Textbox extends Component {
	handleKeyDown = e => {
		switch (e.key) {
			case 'Enter':
				if (this.props.onEnter) this.props.onEnter()
				break
			case 'Tab':
				if (this.props.onTab) this.props.onTab()
				break
			case 'ArrowDown':
				if (this.props.onArrowDown) this.props.onArrowDown()
				break
			case 'ArrowUp':
				if (this.props.onArrowUp) this.props.onArrowUp()
				break
			default:
				break
		}
	}

	render() {
		return (
			<input
				style={this.props.style}
				onKeyDown={this.handleKeyDown}
				type={this.props.type}
				className={this.props.className}
				placeholder={this.props.placeholder}
				maxlength={this.props.maxlength}
				value={this.props.text}
				onChange={e => {
					this.setState({ text: e.target.value })
					if (this.props.onTextChange) this.props.onTextChange(e.target.value)
				}}
			/>
		)
	}
}

export class Spinner extends Component {
	render() {
		return (
			this.props.show && (
				<div class="sk-folding-cube">
					<div class="sk-cube1 sk-cube"></div>
					<div class="sk-cube2 sk-cube"></div>
					<div class="sk-cube4 sk-cube"></div>
					<div class="sk-cube3 sk-cube"></div>
				</div>
			)
		)
	}
}
