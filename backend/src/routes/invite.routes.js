const express=require("express")
const controller=require("../controllers/invite.controller")
const {authUser}=require("../middlewares/auth.middleware")
const rbac=require("../middlewares/rbac.middleware")

const router=express.Router()


router.post("/workspaces/:workspaceId/invite",authUser,rbac(["Owner"]),controller.sendInvite)
router.post("/invite/accept/:token",authUser,controller.acceptInvite)

router.get("/notifications",authUser,controller.getNotification)


module.exports=router
