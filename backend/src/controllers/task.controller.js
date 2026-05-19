const taskModel = require("../models/task.model")
const workspaceModel = require("../models/workspace.model")
const wsUserModel = require("../models/wsUser.model")
const logModel = require("../models/activitylog")
const userModel = require("../models/user.model")

async function taskCreate(req, res) {

    try {
        const { title, description, status, assignToMember, priority } = req.body
        const { workspaceId } = req.params
        const userId = req.user._id


        const user = await userModel.findOne({
            email: assignToMember
        })

        if (!user) {
            return res.status(404).json({ message: "User not exists" })
        }


        //present in workspace
        const ValidUser = await wsUserModel.findOne({
            userId: user._id,
            workspaceId
        })

        if (!ValidUser) {
            return res.status(404).json({ message: "User do not exists in this workspace" })
        }


        const task = await taskModel.create({
            workspaceId,
            title,
            description,
            status,
            assignTo: user._id,
            priority,
            createdBy: userId
        })

        await logModel.create({
            workspaceId,
            actor: req.user._id,
            message: `created task ${title}`
        })



        return res.status(201).json({
            message: "Task created successfully",
            task
        })
    } catch (err) {
        return res.status(500).json({
            message: "Error while creating task",
            error: err.message
        })
    }
}


async function deleteTask(req, res) {

    try {
        const { workspaceId, taskId } = req.params

        const task = await taskModel.findOneAndDelete({
            _id: taskId,
            workspaceId
        })

        if (!task) {
            return res.status(404).json({ message: "Task does not exist" })
        }

        await logModel.create({
            workspaceId,
            actor: req.user._id,
            message: `deleted task ${task.title}`
        })

        return res.status(200).json({ message: "Task deleted successfully" })

    } catch (err) {
        return res.status(500).json({
            message: "Error while deleting task",
            error: err.message
        })
    }

}


async function updateTask(req, res) {

    try {
        const { workspaceId, taskId } = req.params
        const { assignToMember, ...rest } = req.body

        let updateData = { ...rest }

        if (assignToMember !== undefined) {


            const user = await userModel.findOne({
                email: assignToMember
            })

            if (!user) {
                return res.status(404).json({ message: "User not exists" })
            }


            //present in workspace
            const ValidUser = await wsUserModel.findOne({
                userId: user._id,
                workspaceId
            })

            if (!ValidUser) {
                return res.status(404).json({ message: "User do not exists in this workspace" })
            }

            updateData.assignTo = user._id
        }


        const updatedTask = await taskModel.findOneAndUpdate({
            _id: taskId,
            workspaceId
        }, { $set: updateData }, { new: true })

        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found" })
        }

        await logModel.create({
            workspaceId,
            actor: req.user._id,
            message: `updated task ${updatedTask.title}`
        })

        return res.status(200).json({
            message: "Task update successfully",
            updatedTask
        })

    } catch (err) {
        return res.status(500).json({
            message: "Error while updating task",
            error: err.task
        })
    }
}

async function getTask(req, res) {
    try {
        const { workspaceId, taskId } = req.params

        const task = await taskModel.findOne({
            workspaceId,
            _id: taskId
        }).populate("assignTo")

        if (!task) {
            return res.status(404).json("Task not found")
        }

        return res.status(200).json({
            message: "Task fetched successfull",
            task
        })

    } catch (err) {
        return res.status(500).json({
            message: "Error while getting task details",
            error: err.message
        })
    }
}



async function fetchTasks(req, res) {

    try {
        const { workspaceId } = req.params

        const workspace = await workspaceModel.findById(workspaceId)

        if (!workspace) {
            return res.status(400).json({ message: "WorkspaceId is not there" })
        }

        const tasks = await taskModel.find({
            workspaceId
        }).sort({ createdAt: -1 })

        if (tasks.length === 0) {
            return res.status(200).json({ message: "Tasks are not present in a collection", tasks: [] })
        }

        return res.status(200).json({
            message: "Tasks fetched successfully",
            tasks
        })

    } catch (err) {
        return res.status(500).json({
            message: "Error while fetching tasks",
            error: err.message
        })
    }

}


module.exports = { taskCreate, deleteTask, updateTask, getTask, fetchTasks }