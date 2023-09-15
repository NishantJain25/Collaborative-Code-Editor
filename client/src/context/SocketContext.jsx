import { createContext } from "react"
import socketio from "socket.io-client"

export const socket = socketio.connect("http://localhost:3005")
export const SocketContext = createContext()