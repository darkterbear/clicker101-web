import io from 'socket.io-client'
const { BASE_URL } = require('./index')

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
