const wsUserModel = require("../models/wsUser.model")


function rbac(allowedRoles = []) {
    return async function (req, res, next) {
        try {

            const { workspaceId } = req.params
            const userId = req.user._id


            if(!workspaceId){
                return res.status(400).json({message:"Workspace Id is missing"})
            }

            const member = await wsUserModel.findOne({
                userId,
                workspaceId
            })

            if (!member) {
                return res.status(403).json({ message: "You are not member of this workspace" })
            }

            if(allowedRoles.length>0 && !allowedRoles.includes(member.role)){
                return res.status(403).json({message:"Insufficient permission"})
            }

            req.workspaceMember=member

            next()

        } catch(err){

            return res.status(500).json({
                message:"RBAC check failed",
                error:err.message
            })

        }
    }
}


module.exports=rbac