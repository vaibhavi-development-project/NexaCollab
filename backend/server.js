require("dotenv").config()
const app = require("./src/app")
const connectDB = require("./src/db/db")
const http = require("http")
const { Server } = require("socket.io")
const cookie = require("cookie")
const jwt = require("jsonwebtoken")
const userModel = require("./src/models/user.model")



connectDB()

const server = http.createServer(app)

const io = new Server(server, {
   cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true
}
})

// io.use()    authentication

// socket is incoming connection attempt

io.use(async (socket, next) => {

    try {

        const token = socket.handshake.auth?.token;

        if (!token) {
            return next(new Error("No auth token"));
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY)

        const user = await userModel.findById(decode.id)

        if (!user) {
            return next(new Error("User does not exist"))
        }

        socket.user = user
        next()


    } catch (err) {
        return next(new Error("Socket authentication failed"))
    }
})

// io.on() connection
// each client has exactly one socket object


io.on("connection", (socket) => {

    const userId = socket.user._id.toString()

    socket.join(userId)
    console.log("socket connected:", userId)

    socket.on("join-doc", ({ docId }) => {
        socket.join(docId)
        console.log(`user joined document`)
    })

    socket.on("disconnect", () => {
        console.log("Socket disconnected:", userId)
    })
})

app.set("io", io)


const PORT = process.env.PORT || 3000

server.listen(PORT, () => {
    console.log("Server is listening on port:", PORT)
})