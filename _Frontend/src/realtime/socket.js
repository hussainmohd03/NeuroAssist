import { io } from 'socket.io-client'
import { BASE_URL } from '../../globals'

export const createSocket = () => {
  return io(BASE_URL, {
    withCredentials: true,
    reconnection: true,
    reconnectionAttempts: 10,
    transports: ['websocket']
  })
}
