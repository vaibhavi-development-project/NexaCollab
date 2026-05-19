const docModel = require("../models/doc.model")
const workspaceModel = require("../models/workspace.model")
const wsUserModel = require("../models/wsUser.model")
const generateResponse=require("../services/ai.service")
const redis=require("../db/redis")
const logModel=require("../models/activitylog")

async function createDoc(req, res) {

    try {
        const { title, content } = req.body
        const { workspaceId } = req.params
        const userId = req.user._id

        const doc = await docModel.create({
            workspaceId,
            title,
            content,
            createdBy: userId
        })

        await logModel.create({
                    workspaceId,
                    actor:req.user._id,
                    message:`created document ${title}` 
                    // message:`Document is created by ${req.user.fullName.firstName} ${req.user.fullName.lastName}`
                })

        return res.status(201).json({
            message: "document created successfully",
            doc
        })


    } catch (err) {
        return res.status(500).json({
            message: "Error while creating document",
            error: err.message
        })
    }
}

async function docDelete(req, res) {

    try {
        const { docId, workspaceId } = req.params

        const doc = await docModel.findOneAndDelete({
            _id: docId,
            workspaceId
        })
 
        if (!doc) {
            return res.status(404).json({ message: "document does not exist" })
        }

         await logModel.create({
                    workspaceId,
                    actor:req.user._id,
                    message:`deleted document ${doc.title}` 
                    // message:`Document is created by ${req.user.fullName.firstName} ${req.user.fullName.lastName}`
                })

        return res.status(200).json({ message: "Document deleted successfully" })
    } catch (err) {
        return res.status(500).json({
            message: "Error while deleting document",
            Error: err.message
        })
    }
}


async function updateDoc(req, res) {

    try {
        const { docId, workspaceId } = req.params

        const updatedDoc = await docModel.findOneAndUpdate({
            _id: docId,
            workspaceId
        }, {$set:req.body}, { new: true })

        if (!updatedDoc) {
            return res.status(404).json({ message: "Document does not exist" })
        }

         await logModel.create({
                    workspaceId,
                    actor:req.user._id,
                    message:`updated document ${updatedDoc.title}`
                })

        return res.status(200).json({
            message: "Document updated successfully",
            updatedDoc
        })
    } catch (err) {
        return res.status(500).json({
            message: "Error while updating document",
            error: err.message
        })
    }
}


async function fetchDocs(req, res) {

    try {
        const { workspaceId } = req.params

        const workspace = await workspaceModel.findById(workspaceId)

        if (!workspace) {
            return res.status(404).json({ message: "Workspace Id not found" })
        }

        const docs = await docModel.find({workspaceId}).sort({createdAt:-1}).populate("createdBy")

        if (docs.length === 0) {
            return res.status(200).json({ message: "Documents are not present in collection", docs:[] })
        }

        return res.status(200).json({
            message: "Documents fetched successfully",
            docs
        })
    } catch (err) {
        return res.status(500).json({
            message: "Error while fetching Documents",
            error: err.message
        })
    }

}

async function getDoc(req,res){

    try {
        const { workspaceId, docId } = req.params

        const workspace = await workspaceModel.findById(workspaceId)

        if (!workspace) {
            return res.status(400).json({ message: "WorkspaceId is not there" })
        }

        const document = await docModel.findOne({
            workspaceId,
            _id:docId
        })

        if (!document) {
            return res.status(404).json("Document not found")
        }

        return res.status(200).json({
            message: "Document fetched successfull",
            document
        })

    } catch (err) {
        return res.status(500).json({
            message: "Error while getting Document",
            error: err.message
        })
    }
}

async function getSummary(req,res){
    try{

        const {workspaceId, docId}=req.params

        const workspace = await workspaceModel.findById(workspaceId)

        if (!workspace) {
            return res.status(400).json({ message: "WorkspaceId is not there" })
        }

        const document = await docModel.findOne({
            _id: docId,
            workspaceId
        })

        if(!document){
            return res.status(404).json({message:"Document not found"})
        }

        const cachedSummary = await redis.get(`Summary:${workspaceId}:${docId}`)

        if(cachedSummary){
            return res.status(200).json({
                message:"Summary fetched successfully(cached)",
                response: cachedSummary
            })
        }

        const prompt = `
Summarize the following document clearly and concisely:
${document.content}
        `

         const response = await generateResponse(prompt)
 
        await redis.set(
            `Summary:${workspaceId}:${docId}`,
            response,
            "EX",
            24 * 60 * 60
        )

        return res.status(200).json({
            message:"Summary fetched successfully",
            response
        })

    } 
    catch (err) {
    console.log("🔥 SUMMARY ERROR FULL:", err);
    console.log("🔥 MESSAGE:", err.message);
    console.log("🔥 STACK:", err.stack);
}
        return res.status(500).json({
            message:"Error while generating summary",
            error: err.message
        })
    }

// async function getSummary(req,res){
//     try{

//         const {workspaceId, docId}=req.params

//          const workspace = await workspaceModel.findById(workspaceId)

//         if (!workspace) {
//             return res.status(400).json({ message: "WorkspaceId is not there" })
//         }

//         const document=await docModel.findOne({
//             _id:docId,
//             workspaceId
//         })

//         if(!document){
//             return res.status(404).json({message:"Document not found"})
//         }

//         const cachedSummary=await redis.get(`Summary:${workspaceId}:${docId}`)

//         if(cachedSummary){
//             return res.status(200).json({message:"Summary fetched successfully(cached)",response:cachedSummary})
//         }

//         const prompt=`Summarize the following document clearly and concisely:
//         ${document.content} 
//          `

//         const response=await generateResponse(prompt)

//         await redis.set(`Summary:${workspaceId}:${docId}`,response,"EX", 24 * 60 * 60)

//         return res.status(200).json({
//             message:"Summary fetched successfully",
//             response
//         })
        


//     }catch(err){
//         return res.status(500).json({
//             message:"Error while generating summary",
//             error:err.message
//         })
//     }
// }



module.exports = { createDoc, docDelete, updateDoc, fetchDocs, getDoc, getSummary}