const mongoose=require("mongoose")


const workspaceSchema=new mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    icon:{
        type:String,
        // required:true
    },
    ownerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    }
},{timestamps:true})


const workspaceModel=mongoose.model("workspace",workspaceSchema)


module.exports=workspaceModel