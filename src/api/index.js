const BASE_URL = 'https://clicker101-api.terranceli.com'
const POST = (path, body) => {
	return fetch(BASE_URL + path, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body),
		credentials: 'include'
	})
}

const GET = (path, query) => {
	return fetch(
		BASE_URL + path + (query ? `?${query.field}=${query.value}` : ''),
		{
			method: 'GET',
			headers: {
				Accept: 'application/json'
			},
			credentials: 'include'
		}
	)
}

exports.BASE_URL = BASE_URL
exports.POST = POST
exports.GET = GET

exports.authenticate = (email, password) => {
	return POST('/api/authenticate', {
		email,
		password
	})
}

exports.register = (email, name, password, type) => {
	return POST('/api/register', {
		email,
		password,
		name,
		type
	})
}

exports.logout = () => {
	return POST('/api/logout', {})
}
