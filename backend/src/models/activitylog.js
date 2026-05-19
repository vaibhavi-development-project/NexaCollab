const mongoose=require("mongoose")


const logSchema=new mongoose.Schema({

    workspaceId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"workspace",
        required:true
    },
    actor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    message:{
        type:String,
        required:true
    }

},{timestamps:true})

const logModel=mongoose.model("activityLog",logSchema)

module.exports=logModel