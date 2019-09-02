const isValidEmail = s => {
	let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	return re.test(s.toLowerCase())
}

const isOnlyWhitespace = s => {
	if (s === '') return true
	return s.replace(/\s/g, '').length === 0
}

const modalStyle = {
	content: {
		top: '50%',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		marginRight: '-50%',
		transform: 'translate(-50%, -50%)',
		border: 'none',
		boxShadow:
			'0 4px 8px 0 rgba(0, 0, 0, 0.12), 0 2px 4px 0 rgba(0, 0, 0, 0.08)'
	}
}

const formatDate = date => {
	var monthNames = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	]

	var day = date.getDate()
	var monthIndex = date.getMonth()
	var year = date.getFullYear()

	return monthNames[monthIndex] + ' ' + day + ', ' + year
}

module.exports = {
	isValidEmail,
	isOnlyWhitespace,
	modalStyle,
	formatDate
}
