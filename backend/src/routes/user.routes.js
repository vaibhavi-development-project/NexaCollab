const express=require("express")
const validator=require("../middlewares/validator.middleware")
const controller=require("../controllers/user.controller")
const {authUser}=require("../middlewares/auth.middleware")
const router=express.Router()


router.post("/register",validator.registerUserValidator,controller.registerUser)
router.post("/login",validator.loginUserValidator,controller.loginUser)
router.post("/logout",controller.logoutUser)
router.get("/getUser",authUser,controller.getUser)
router.patch("/update",authUser,controller.updateUser)

// router.get("/getme",controller.getme)

module.exports=router