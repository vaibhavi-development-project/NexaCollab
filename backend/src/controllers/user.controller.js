const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const Redis = require("../db/redis")

async function registerUser(req, res) {

    try {
        const { email, fullName: { firstName, lastName }, password } = req.body

        const isUserExist = await userModel.findOne({
            email
        })

        if (isUserExist) {
            return res.status(409).json({
                message: "User already exist"
            })
        }

        const avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${firstName}+${lastName}`

        const hashedPass = await bcrypt.hash(password, 10)

        const User = await userModel.create({
            email,
            fullName: {
                firstName,
                lastName
            },
            password: hashedPass,
            avatar

        })

        const token = jwt.sign({
            id: User._id,
            email: User.email,

        }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" })


        // res.cookie("token", token, {
        //     httpOnly: true,
        //     secure: true,
        //     sameSite: "none",
        //     maxAge: 7 * 24 * 60 * 60 * 1000
        // });

        res.status(201).json({
            message: "User registered successfully",
            User,
            token
        })

    } catch (err) {
        res.status(500).json({
            message: "Error while registering User",
            Error: err.message
        })
    }

}

async function loginUser(req, res) {

    try {
        const { email, password } = req.body

        const User = await userModel.findOne({
            email
        }).select("+password")

        if (!User) {
            return res.status(400).json({
                message: "User is not registred"
            })
        }

        const isMatch = await bcrypt.compare(password, User.password)

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid Password "
            })
        }

        const token = jwt.sign({
            id: User._id,
            email: User.email,

        }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" })


        // res.cookie("token", token, {
        //     httpOnly: true,
        //     secure: true,
        //     sameSite: "none",
        //     maxAge: 7 * 24 * 60 * 60 * 1000
        // });

        return res.status(200).json({
            message: "User logged in successfully",
            token,
            User
        })

    } catch (err) {
        return res.status(500).json({
            message: "Failed to Login",
            error: err.message
        })
    }
}

async function logoutUser(req, res) {

    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(400).json({ message: "No token provided" });
        }
console.log("AUTH HEADER:", req.headers.authorization)
        const token = authHeader.split(" ")[1];

        if (token) {
            await Redis.set(`blacklist:${token}`, "true", "EX", 24 * 60 * 60)
        }

        // res.clearCookie("token", {
        //     httpOnly: true,
        //     secure: true,
        //     sameSite: "none"
        // })

        return res.status(200).json({ message: "logout successfully" })


    } catch (err) {
        return res.status(500).json({
            message: "Error while logging out",
            error: err.message
        })
    }
}

// async function getme(req, res) {

//     try {
//         const token = req.cookies.token

//         if (!token) {
//             return res.status(400).json({ message: "Token does not exists", authenticated: false })
//         }

//         const isBlacklisted = await Redis.get(`blacklist:${token}`)

//         if (isBlacklisted) {
//             return res.status(400).json({
//                 message: "token is blacklisted",
//                 authenticated: false
//             })
//         }

//         let decoded;
//         try {
//             decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
//         } catch (err) {
//             return res.status(401).json({ authenticated: false, message: err.message });
//         }


//         return res.status(200).json({ authenticated: true })

//     } catch (err) {
//         return res.status(500).json({
//             message: "Error while verifying",
//             error: err.message
//         })
//     }
// }


async function getUser(req, res) {

    try {

        const user = req.user


        return res.status(200).json({
            message: "User data fetched successfully",
            user: user
        })


    } catch (err) {
        return res.status(500).json({
            message: "Error while fetching user data",
            error: err.message
        })
    }


}

async function updateUser(req, res) {

    try {

        const userId = req.user._id

        const allowedUpdates = {
            "fullName.firstName": req.body.firstName,
            "fullName.lastName": req.body.lastName,
            "avatar": `https://api.dicebear.com/7.x/initials/svg?seed=${req.body.firstName}+${req.body.lastName}`
        }


        const updatedUser = await userModel.findByIdAndUpdate({
            _id: userId
        }, { $set: allowedUpdates }, { new: true })

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" })
        }


        return res.status(200).json({
            message: "User updated successfully",
            updatedUser
        })


    } catch (err) {
        return res.status(500).json({
            message: "Error while updating user info",
            error: err.message
        })
    }

}

module.exports = { registerUser, loginUser, logoutUser, getUser, updateUser }