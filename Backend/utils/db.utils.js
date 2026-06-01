import mongoose from "mongoose";

const db = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to Database");
    }catch(err){
        console.error("error connecting to Database",err.message);
        process.exit(1);
    }
}

export default db;