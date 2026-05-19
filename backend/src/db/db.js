const mongoose=require("mongoose")


async function connectDB(){

    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Connected to database successfull")
    
    }catch(err){
        console.log("or while connecting to DB",err)
    }
}


module.exports=connectDB