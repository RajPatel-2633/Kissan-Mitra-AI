import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import User from "../models/User.models.js";
import { BadRequestError, ConflictError, NotFoundError, UnauthorizedError } from "../utils/ApiError.utils.js";
import ApiResponse from "../utils/ApiResponse.utils.js";
import asyncHandler from "../utils/AsyncHandler.utils.js";


const registerUser = asyncHandler(async(req,res,next)=>{
    const {name,email,password}=req.body;
    if(!name || !email || !password){
        throw new BadRequestError("All Fields are required");
    }
    const user = await User.findOne({email});
    if(user){
        throw new ConflictError("User Already Exists");
    }
    const newUser = await User.create({name,email,password});

     const userResponse = {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
    };

    return res.status(201).json(new ApiResponse(201,userResponse,"User Registered Successfully"));
});

const loginUser = asyncHandler(async(req,res,next)=>{
    const {email,password}=req.body;
    if(!email || !password){
        throw new BadRequestError("All Fields are required");
    }
    const user = await User.findOne({email});
    if(!user){
        throw new NotFoundError("User not found");
    }
    const isMatched = await bcrypt.compare(password,user.password);
    if(!isMatched){
        throw new UnauthorizedError("Incorrect Password");
    }
    const accessCookieOptions={
        maxAge:1000*60*15,
        httpOnly:true,
        secure:true,
        sameSite:"lax"
    }
    const refreshCookieOptions={
        maxAge:1000*60*15,
        httpOnly:true,
        secure:true,
        sameSite:"lax"
    }

    const accessToken = jwt.sign({
        id:user._id,
        role:user.role
    },process.env.ACCESS_SECRET,{
        expiresIn:"15m"
    });

    const refreshToken = jwt.sign({
        id:user._id,
        role:user.role
    },process.env.REFRESH_SECRET,{
        expiresIn:"7d"
    });

    res.cookie("accessToken",accessToken,accessCookieOptions);
    res.cookie("refreshToken",refreshToken,refreshCookieOptions);
    return res.status(200).json(new ApiResponse(200,accessToken,"User Logged in Successfully"));
});

const getProfile = asyncHandler(async(req,res,next)=>{
    const id = req.user.id;
    const user = await User.findById(id).select("-password");
    if(!user){
        throw new NotFoundError("User Not Found");
    }
    return res.status(200).json(new ApiResponse(200,user,"User Profile Fetched Successfully"));
});

const forgotPassword = asyncHandler(async(req,res,next)=>{
    const {email} = req.body;
    if(!email){
        throw new BadRequestError("All Fields are required");
    }
    const user = await User.findOne({email});
    if(!user){
        throw new NotFoundError("User Not Found");
    }
    let OTP="";
    for(let i=0;i<5;i++){
        OTP+=Math.floor(Math.random()*10);
    }
    user.OTP=OTP;
    user.resetPassword = true;
    user.OTP_Expiry=new Date(Date.now()+1000*60*15);
    await user.save();

    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_HOST,
        port: process.env.MAILTRAP_PORT,
        secure: false, 
        auth: {
            user: process.env.MAILTRAP_USER,
            pass: process.env.MAILTRAP_PASS,
        },
    });

    const mailOptions = {
        from:process.env.SENDER_MAIL,
        to:user.email,
        subject:"Verify with your OTP",
        text:`Please enter your OTP ${OTP}`,
    }

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        user.OTP = undefined;
        user.OTP_Expiry = undefined;
        user.resetPassword = false;
        await user.save();

        throw new InternalServerError("Failed to send OTP email");
    }


    return res.status(200).json(new ApiResponse(200,null,"OTP sent successfully"));

});

const verifyOTP = asyncHandler(async(req,res,next)=>{
    const {email,OTP} = req.body;
    if(!email || !OTP){
        throw new BadRequestError("All Fields are Required");
    }
    const user = await User.findOne({email});
    if(!user){
        throw new NotFoundError("User not Found");
    }
    const isMatched = user.OTP === OTP;
    if(!isMatched){
        throw new ConflictError("Incorrect OTP");
    }
    user.OTP=null;
    user.OTP_Expiry=null;
    await user.save();
    return res.status(200).json(new ApiResponse("OTP verified successfully"));
});

const resetPassword = asyncHandler(async(req,res,next)=>{
    const{email,newPassword}=req.body;
    if(!email || !newPassword){
        throw new BadRequestError("All Fields are required");
    }
    const user = await User.findOne({email});
    if(!user){
        throw new NotFoundError("User not Found");
    }
    user.password=newPassword;
    user.resetPassword=false;
    await user.save();
    return res.status(200).json(new ApiResponse(200,null,"Password Updated Successfully"));
});

const updateProfile =  asyncHandler(async(req,res,next)=>{
    const userId = req.user.id;
    const {name,newPassword} = req.body;
    const user = await User.findById(userId);
    if(!user){
        throw new NotFoundError("User Not Found");
    }
    if(name){
        user.name = name;
    }
    if(newPassword){
        user.password = newPassword;
    }
    await user.save();

    return res.status(200).json(new ApiResponse(200,null,"User Profile Updated Successfully"));
    
});

const logoutUser = asyncHandler(async(req,res,next)=>{
    const id = req.user.id;
    res.clearCookie('accessToken',{
        secure:true,
        httpOnly:true,
        sameSite:"lax"
    });

    res.clearCookie('refreshToken',{
        secure:true,
        httpOnly:true,
        sameSite:"lax"
    })
    
    return res.status(200).json(new ApiResponse(200,null,"User Logged Out Successfully"));
    
});

export {registerUser,loginUser,getProfile,forgotPassword,verifyOTP,resetPassword,updateProfile,logoutUser};