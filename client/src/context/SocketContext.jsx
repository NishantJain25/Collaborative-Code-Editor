import { createContext } from "react"
import socketio from "socket.io-client"

export const socket = socketio.connect("https://collabinator-server.onrender.com")
export const SocketContext = createContext()