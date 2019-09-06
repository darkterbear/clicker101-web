import io from 'socket.io-client'
const { BASE_URL } = require('./index')

// TODO: CHANGE THIS IN PRODUCTION
const socket = io(BASE_URL, { secure: false })

const SocketEventHandlers = {
	subscribeToProgress: cb => {
		socket.on('progress', cb)
	},
	unsubscribeToProgress: () => {
		socket.on('progress', () => {})
	}
}

export default SocketEventHandlers
