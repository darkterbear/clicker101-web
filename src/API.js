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
