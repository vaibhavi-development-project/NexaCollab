const mongoose=require("mongoose")


const wsUserSchema=new mongoose.Schema({

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    workspaceId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"workspace",
        required:true
    },
    role:{
        type:String,
        enum:["Owner","Admin","Member"],
        require:true
    }
   
},{timestamps:true})

wsUserSchema.index({ workspaceId: 1, userId: 1 }, { unique: true });


const wsUserModel=mongoose.model("wcUser",wsUserSchema)


module.exports=wsUserModel