const isValidEmail = s => {
	let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	return re.test(s.toLowerCase())
}

const isOnlyWhitespace = s => {
	if (s === '') return true
	return s.replace(/\s/g, '').length === 0
}

module.exports = {
	isValidEmail,
	isOnlyWhitespace
}
