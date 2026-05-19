const express=require("express")
const controller=require("../controllers/document.controller")
const {authUser}=require("../middlewares/auth.middleware")
const rbac = require("../middlewares/rbac.middleware")


const router=express.Router()


router.post("/workspaces/:workspaceId/documents",authUser,rbac(["Owner","Admin"]),controller.createDoc)
router.patch("/workspaces/:workspaceId/documents/:docId",authUser,rbac(["Owner","Admin"]),controller.updateDoc)
router.delete("/workspaces/:workspaceId/documents/:docId",authUser,rbac(["Owner","Admin"]),controller.docDelete)
router.get("/workspaces/:workspaceId/documents/:docId",authUser,rbac(["Owner","Admin","Member"]),controller.getDoc)


// get all documents
router.get("/workspaces/:workspaceId/documents",authUser,rbac(["Owner","Admin","Member"]),controller.fetchDocs)


// ai summary
router.get("/workspaces/:workspaceId/documents/:docId/summary",authUser,rbac(["Admin","Owner","Member"]),controller.getSummary)

module.exports=router