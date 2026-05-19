import { io } from "socket.io-client"

const token = localStorage.getItem("token");

const socket = io(import.meta.env.VITE_BACKEND_URL, {
    auth: {
    token: token
  }
})



export default socket;