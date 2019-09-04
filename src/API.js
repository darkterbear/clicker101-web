const BASE_URL = 'http://localhost:3000'

exports.authenticate = (email, password) => {
	return fetch(BASE_URL + '/api/authenticate', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			email,
			password
		}),
		credentials: 'include'
	})
}

exports.register = (email, name, password, type) => {
	return fetch(BASE_URL + '/api/register', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			email,
			password,
			name,
			type
		})
	})
}

exports.teacherFetchClasses = () => {
	return fetch(BASE_URL + '/api/teachers/fetch-classes', {
		method: 'GET',
		headers: {
			Accept: 'application/json'
		},
		credentials: 'include'
	})
}

exports.createClass = name => {
	return fetch(BASE_URL + '/api/teachers/create-class', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			name
		}),
		credentials: 'include'
	})
}

exports.teacherFetchClass = id => {
	return fetch(BASE_URL + `/api/teachers/fetch-class?classId=${id}`, {
		method: 'GET',
		headers: {
			Accept: 'application/json'
		},
		credentials: 'include'
	})
}

exports.teacherFetchProblemSet = id => {
	return fetch(
		BASE_URL + `/api/teachers/fetch-problem-set?problemSetId=${id}`,
		{
			method: 'GET',
			headers: {
				Accept: 'application/json'
			},
			credentials: 'include'
		}
	)
}

exports.createProblemSet = (name, classId, problems = []) => {
	return fetch(BASE_URL + '/api/teachers/create-problem-set', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			name,
			classId,
			problems
		}),
		credentials: 'include'
	})
}

exports.addProblem = (problemSetId, question, choices, correct) => {
	return fetch(BASE_URL + '/api/teachers/add-problem', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			problemSetId,
			question,
			choices,
			correct
		}),
		credentials: 'include'
	})
}

exports.deleteProblem = (problemSetId, problemNumber) => {
	return fetch(BASE_URL + '/api/teachers/delete-problem', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			problemSetId,
			problemNumber
		}),
		credentials: 'include'
	})
}

exports.editProblem = (
	problemSetId,
	problemNumber,
	question,
	choices,
	correct
) => {
	return fetch(BASE_URL + '/api/teachers/edit-problem', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			problemSetId,
			problemNumber,
			question,
			choices,
			correct
		}),
		credentials: 'include'
	})
}

exports.executeProblemSet = problemSetId => {
	return fetch(BASE_URL + '/api/teachers/execute-problem-set', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			problemSetId
		}),
		credentials: 'include'
	})
}

exports.startNextProblem = classId => {
	return fetch(BASE_URL + '/api/teachers/start-next-problem', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			classId
		}),
		credentials: 'include'
	})
}

exports.stopThisProblem = classId => {
	return fetch(BASE_URL + '/api/teachers/stop-this-problem', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			classId
		}),
		credentials: 'include'
	})
}

exports.editClassName = (name, classId) => {
	return fetch(BASE_URL + '/api/teachers/edit-class-name', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			name,
			classId
		}),
		credentials: 'include'
	})
}

exports.deleteClass = classId => {
	return fetch(BASE_URL + '/api/teachers/delete-class', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			classId
		}),
		credentials: 'include'
	})
}

exports.editProblemSetName = (name, problemSetId) => {
	return fetch(BASE_URL + '/api/teachers/edit-problem-set-name', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			name,
			problemSetId
		}),
		credentials: 'include'
	})
}

exports.deleteProblemSet = problemSetId => {
	return fetch(BASE_URL + '/api/teachers/delete-problem-set', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			problemSetId
		}),
		credentials: 'include'
	})
}
