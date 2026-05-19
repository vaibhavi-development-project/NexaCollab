const express=require("express")
const controller=require("../controllers/ws.controller")
const {authUser}=require("../middlewares/auth.middleware")
const rbac=require("../middlewares/rbac.middleware")

const router=express.Router()


router.get("/workspaces",authUser,controller.getMyWorkspaces)


router.post("/workspace",authUser,controller.wcCreate)
router.delete("/workspaces/:workspaceId",authUser,rbac(["Owner"]),controller.deleteWorkspace)
router.get("/workspaces/:workspaceId",authUser,controller.getWs)

// activity logs
router.get("/workspaces/:workspaceId/activityLog",authUser,rbac(["Admin","Owner","Member"]),controller.getActivityLogs)


router.get("/workspaces/:workspaceId/team",authUser,rbac(["Admin","Owner","Member"]),controller.team)




module.exports=router