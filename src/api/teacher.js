const { POST, GET } = require('./index')

exports.teacherFetchClasses = () => {
	return GET('/api/teachers/fetch-classes')
}

exports.createClass = name => {
	return POST('/api/teachers/create-class', { name })
}

exports.teacherFetchClass = id => {
	return GET('/api/teachers/fetch-class', { field: 'classId', value: id })
}

exports.teacherFetchProblemSet = id => {
	return GET('/api/teachers/fetch-problem-set', {
		field: 'problemSetId',
		value: id
	})
}

exports.createProblemSet = (name, classId, problems = []) => {
	return POST('/api/teachers/create-problem-set', {
		name,
		classId,
		problems
	})
}

exports.addProblem = (problemSetId, question, choices, correct) => {
	return POST('/api/teachers/add-problem', {
		problemSetId,
		question,
		choices,
		correct
	})
}

exports.deleteProblem = (problemSetId, problemNumber) => {
	return POST('/api/teachers/delete-problem', {
		problemSetId,
		problemNumber
	})
}

exports.editProblem = (
	problemSetId,
	problemNumber,
	question,
	choices,
	correct
) => {
	return POST('/api/teachers/edit-problem', {
		problemSetId,
		problemNumber,
		question,
		choices,
		correct
	})
}

exports.executeProblemSet = problemSetId => {
	return POST('/api/teachers/execute-problem-set', {
		problemSetId
	})
}

exports.startNextProblem = classId => {
	return POST('/api/teachers/start-next-problem', {
		classId
	})
}

exports.stopThisProblem = classId => {
	return POST('/api/teachers/stop-this-problem', {
		classId
	})
}

exports.editClassName = (name, classId) => {
	return POST('/api/teachers/edit-class-name', {
		name,
		classId
	})
}

exports.deleteClass = classId => {
	return POST('/api/teachers/delete-class', {
		classId
	})
}

exports.editProblemSetName = (name, problemSetId) => {
	return POST('/api/teachers/edit-problem-set-name', {
		name,
		problemSetId
	})
}

exports.deleteProblemSet = problemSetId => {
	return POST('/api/teachers/delete-problem-set', {
		problemSetId
	})
}
