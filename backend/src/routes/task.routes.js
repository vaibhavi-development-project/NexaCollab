const express=require("express")
const controller=require("../controllers/task.controller")
const {authUser}=require("../middlewares/auth.middleware")
const rbac=require("../middlewares/rbac.middleware")

const router=express.Router()


router.post("/workspaces/:workspaceId/task",authUser,rbac(["Admin","Owner"]),controller.taskCreate)
router.delete("/workspaces/:workspaceId/task/:taskId",authUser,rbac(["Owner","Admin"]),controller.deleteTask)
router.patch("/workspaces/:workspaceId/task/:taskId",authUser,rbac(["Owner","Admin"]),controller.updateTask)
router.get("/workspaces/:workspaceId/task/:taskId",authUser,rbac(["Member","Owner","Admin"]),controller.getTask)
router.get("/workspaces/:workspaceId/tasks",authUser,rbac(["Member","Owner","Admin"]),controller.fetchTasks)

module.exports=router