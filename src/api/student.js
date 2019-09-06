const { POST, GET } = require('./index')

exports.studentFetchClasses = () => {
	return GET('/api/students/fetch-classes')
}

exports.joinClass = code => {
	return POST('/api/students/join-class', { code })
}

exports.leaveClass = classId => {
	return POST('/api/students/leave-class', { classId })
}

exports.studentFetchClass = classId => {
	return GET('/api/students/fetch-class', { field: 'classId', value: classId })
}

exports.getProblem = classId => {
	return GET('/api/students/get-problem', { field: 'classId', value: classId })
}

exports.answer = (classId, answer) => {
	return POST('/api/students/answer', { classId, answer })
}
