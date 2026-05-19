const wsUserModel = require("../models/wsUser.model")
const inviteModel = require("../models/invite.model")
const crypto = require("crypto")
const Notification = require("../models/notification")
const userModel = require("../models/user.model")
const logModel = require("../models/activitylog")
const workspaceModel = require("../models/workspace.model")

async function sendInvite(req, res) {

    try {
        const { email, role } = req.body
        const { workspaceId } = req.params

        const workspace=await workspaceModel.findById(workspaceId)
         if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" })
        }

        const token = crypto.randomBytes(32).toString("hex")

        await inviteModel.create({
            workspaceId,
            email,
            role,
            token,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
        })

        const invitedUser = await userModel.findOne({ email })

        if (!invitedUser) {
            return res.status(404).json({ message: "Invited user not found!" })
        }


        await Notification.create({
            userId: invitedUser._id,
            type: "Invite",
            message: `You have been invited to join the workspace ${workspace.name}`,
            token,
        })

        const io = req.app.get("io")
        io.to(invitedUser._id.toString()).emit("notification", {
            type: "Invite",
            message: `You have been invited to join the workspace:${workspace.name} as role ${role} by -${req.user.fullName.firstName} ${req.user.fullName.lastName}`,
            token
        })


        await logModel.create({
            workspaceId,
            actor: req.user._id,
            message: `sended invitiation to ${email} `
        })

        return res.status(201).json({
            message: "Invite sent",
            inviteLink: `invite/accept/${token}`
        })


    } catch (err) {
        return res.status(500).json({
            message: "Error while sending invite",
            error: err.message
        })
    }



}


async function acceptInvite(req, res) {

    try {

        const { token } = req.params
        const userEmail = req.user.email
        const userId = req.user._id

        const invite = await inviteModel.findOne({
            token,
            used: false,
            expiresAt: { $gt: new Date() }
        })


        if (!invite) {
            await Notification.updateMany(
                {
                    userId: req.user._id,
                    token,
                    isRead: false
                },
                { $set: { isRead: true } }
            )
            return res.status(400).json({ message: "Invalid or expired token" })
        }

        if (invite.email !== userEmail) {
            return res.status(403).json({ message: "Invitation is not for you" })
        }

        const exists = await wsUserModel.findOne({
            workspaceId: invite.workspaceId,
            userId
        })

        if (exists) {
            exists.role = invite.role
            await exists.save()

            invite.used = true
            await invite.save()

            await Notification.updateMany({
                userId: req.user._id,
                token,
                isRead: false
            }, { $set: { isRead: true } });


            return res.status(200).json({ message: "Workspace role update successfully" })
        }

        const wsUser = await wsUserModel.create({
            userId,
            workspaceId: invite.workspaceId,
            role: invite.role
        })

        invite.used = true

        await invite.save()

        await Notification.updateMany({
            userId: req.user._id,
            token,
            isRead: false
        }, { $set: { isRead: true } });

        await logModel.create({
            workspaceId: invite.workspaceId,
            actor: req.user._id,
            message: "accepted invitation"
        })

        const io = req.app.get("io")

        io.to(userId.toString()).emit("workspaceAdded")
        io.to(userId.toString()).emit("roleChanged")

        return res.status(201).json({
            message: "Invitation accepted successfully",
            wsUser
        })

    } catch (err) {

        return res.status(500).json({
            message: "Error while accepting invitation",
            error: err.message
        })
    }
}

async function getNotification(req, res) {

    try {

        const userId = req.user._id

        const notifications = await Notification.find({
            userId,
            isRead: false
        }).sort({ createdAt: -1 })

        if(notifications.length === 0){
            return res.status(200).json({message:"Notifications not found", notifications:[]})
        }

        return res.status(200).json({
            message: "Notifications fetched successfully",
            notifications
        })
    } catch (err) {
        return res.status(500).json({
            message: "Error while getting notifications ",
            error: err.message
        })
    }
}

module.exports = { sendInvite, acceptInvite, getNotification }