const mongoose=require("mongoose")

const docSchema=new mongoose.Schema({

    workspaceId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"workspace",
        required:true,
    },
    title:{
        type:String,
        required:true,
        trim:true
    },
    content:{
        type:String,
        required:true,
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,
    }

},{
    timestamps:true
})

const docModel=mongoose.model("documents",docSchema)

module.exports=docModel