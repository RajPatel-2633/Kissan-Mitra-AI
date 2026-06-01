import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        lowercase:true,
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    role:{
        type:String,
        enum:["Admin","User"],
        default:"User",
    },
    OTP:{
        type:String,
    },
    OTP_Expiry:{
        type:Date,
    },
    resetPassword:{
        type:Boolean,
        default:false
    }
},{timestamps:true});


userSchema.pre("save",async function(){
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password,10);
    
})

const User = mongoose.model("User",userSchema);

export default User;