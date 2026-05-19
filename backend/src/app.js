const cookieParser = require("cookie-parser")
const express=require("express")
const authRoutes=require("./routes/user.routes")
const wsRoutes=require("./routes/workspace.routes")
const InviteRoutes=require("./routes/invite.routes")
const DocRoutes=require("./routes/document.routes")
const taskRoutes=require("./routes/task.routes")
const cors=require("cors")


const app=express()


app.use(cors({
  origin: process.env.FRONTEND_URL, 
  // credentials: true
}));

app.use(express.json())
app.use(cookieParser())

app.use("/api",authRoutes)
app.use("/api",wsRoutes)
app.use("/api",InviteRoutes)
app.use("/api",DocRoutes)
app.use("/api",taskRoutes)



module.exports=app