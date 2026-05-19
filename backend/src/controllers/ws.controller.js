const taskModel = require("../models/task.model")
const docModel = require("../models/doc.model")
const inviteModel = require("../models/invite.model")
const workspaceModel = require("../models/workspace.model")
const wsUserModel = require("../models/wsUser.model")
const logModel = require("../models/activitylog")




async function wcCreate(req, res) {

    try {
        const { name, description} = req.body
        userId = req.user._id

        const workspace = await workspaceModel.create({
            name,
            description,
            ownerId: userId
        })

        const wsUser = await wsUserModel.create({
            workspaceId: workspace._id,
            userId,
            role: "Owner"
        })

        const io = req.app.get("io")

        io.to(userId.toString()).emit("workspaceAdded")

        return res.status(201).json({
            message: "workspace created successfully",
            workspace,
            wsUser
        })
    } catch (err) {
        return res.status(500).json({
            message: "Error while creating workspace",
            error: err.message
        })
    }

}


async function getMyWorkspaces(req, res) {

    try {
        const userId = req.user._id

        const workspaces = await wsUserModel.find({
            userId
        }).sort({createdAt:-1}).populate("workspaceId")

        if (workspaces.length === 0) {
            return res.status(200).json({ message: "Workspaces are not present in collection", workspaces:[] })
        }

        return res.status(200).json({
            message: "Workspaces fetched successfully",
            workspaces
        })

    } catch (err) {
        return res.status(500).json({
            message: "Error while fetching workspaces",
            error: err.message
        })
    }
}


async function deleteWorkspace(req, res) {

    try {
        const { workspaceId } = req.params

        const workspace = await workspaceModel.findById(workspaceId)

        if (!workspace) {
            return res.status(400).json({ message: "Workspace does not exists" })
        }

        await Promise.all([
            wsUserModel.deleteMany({ workspaceId }),
            taskModel.deleteMany({ workspaceId }),
            docModel.deleteMany({ workspaceId }),
            inviteModel.deleteMany({ workspaceId })
        ])

        await workspaceModel.findByIdAndDelete(workspaceId)

        return res.status(200).json({ message: "Workspace deleted successfully" })
    } catch (err) {
        return res.status(500).json({
            message: "Error while deleting the workspace",
            error: err.message
        })
    }

}


async function getWs(req, res) {

    try {

        const { workspaceId } = req.params

        const workspace = await workspaceModel.findById(workspaceId)

        if (!workspace) {
            return res.status(404).json({ message: "workspace does not exits" })
        }

        return res.status(200).json({
            message: "Workspace fetched successfully",
            workspace
        })
    } catch (err) {

        return res.status(500).json({
            message: "Error while fetching workspace",
            error: err.message
        })

    }
}



async function getActivityLogs(req, res) {

    try {

        const { workspaceId } = req.params

        const workspace = await workspaceModel.findById(workspaceId)

        if (!workspace) {
            return res.status(404).json({ message: "workspace does not exits" })
        }

        const logs = await logModel.find({
            workspaceId
        }).populate("actor").sort({ createdAt: -1 })

        if (logs.length === 0) {
            return res.status(200).json({ message: "Logs are not present in collection", logs:[] })
        }

        return res.status(200).json({ message: "Logs fetched successfully", logs })


    } catch (err) {
        res.status(500).json({
            message: "Error while fetching logs",
            error: err.message
        })
    }
}


async function team(req, res) {

    try {
        const { workspaceId } = req.params

        const teamMember = await wsUserModel.find({
            workspaceId
        }).populate("userId")

        if (teamMember === 0) {
            return res.status(200).json({ message: "Team members are not present in collection",  teamMember:[] })
        }

        return res.status(200).json({
            message: "Member fetched successfully",
            teamMember
        })
    } catch (err) {
        return res.status(500).json({
            message: "Error while fecthing members of workspace",
            error: err.message
        })
    }


}

module.exports = { wcCreate, getMyWorkspaces, deleteWorkspace, getWs, getActivityLogs, team }