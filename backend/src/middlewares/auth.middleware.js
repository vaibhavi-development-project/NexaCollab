const jwt = require("jsonwebtoken")
const userModel = require("../models/user.model")
const Redis = require("../db/redis")

async function authUser(req, res, next) {

    try {

        // const token = req.cookies.token

        // console.log(token)

        const authHeader = req.headers.authorization;
        // if (!token) {
        //     return res.status(401).json({
        //         message: "User unauthenticated"
        //     })
        // 
        
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        
        const token = authHeader.split(" ")[1];

        const blacklisted = await Redis.get(`blacklist:${token}`)
        if (blacklisted) {
            return res.status(401).json({ message: "Token revoked" })
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY)

        const User = await userModel.findById(decode.id)

        if (!User) {
            return res.status(404).json({
                message: "User not found"
            })
        }


        req.user = User

        next()

    } catch (err) {
        return res.status(500).json({
            message: "Error while verifying authentication",
            error: err.message
        })
    }

}


module.exports = { authUser }