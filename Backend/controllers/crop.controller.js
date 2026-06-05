import axios from "axios";
import FormData from "form-data";
import { BadRequestError, NotFoundError } from "../utils/ApiError.utils.js";
import asyncHandler from "../utils/AsyncHandler.utils.js";
import { model } from "mongoose";
import History from "../models/History.models.js";
import ApiResponse from "../utils/ApiResponse.utils.js";
import { response } from "express";


const diagnoseCrop = asyncHandler(async(req,res,next)=>{
    if(!req.file){
        throw new BadRequestError("No Leaf Image Uploaded");
    }

    const cloudinaryImageURL = req.file.path;

    const form = new FormData();
    const image = await axios.get(cloudinaryImageURL,{
        responseType:'arraybuffer'
    });

    const imageBuffer = Buffer.from(image.data);

    form.append('image',image.data,{
        filename: req.file.originalname,
        contentType: req.file.mimetype
    });


    const modelResponse = await axios.post(`${process.env.FASTAPI_URI}/predict`,form,{
        headers:{...form.getHeaders()}
    });

    const { disease, display_name, confidence, is_healthy } = modelResponse.data;

    const newScanRecord = await History.create({
        userId:req.user.id,
        imageUrl:cloudinaryImageURL,
        diseaseCode:disease,
        displayName:display_name,
        confidence:confidence,
        isHealthy:is_healthy,
        chatLog:[]
    });

    const responseData = {
        recordId: newScanRecord._id,
        diseaseCode: disease,
        displayName: display_name,
        confidence,
        isHealthy: is_healthy,
        imageUrl: cloudinaryImageURL
    }

    return res.status(201).json(new ApiResponse(201,responseData,"Diagnosed Crop Successfully"));

});

const chatWithAI = asyncHandler(async(req,res,next)=>{
    const {message, language} = req.body;
    const {recordId} = req.params;

    if(!message){
        throw new BadRequestError("Message Content cannot be blank");
    }
    const userId = req.user.id;
    const historySession = await History.findOne({ _id: recordId, userId });
    if(!historySession){
        throw new NotFoundError("Diagnosis Not Found");
    }

    const RAGResponse = await axios.post(`${process.env.FASTAPI_URI}/chat/remedy`,{
        user_query: message,
        detected_disease: historySession.diseaseCode,
        language: language || 'English'
    })

    const AIReply =  RAGResponse.data.reply;

    historySession.chatLog.push({ sender: 'farmer', message: message });
    historySession.chatLog.push({ sender: 'ai', message: AIReply });
    await historySession.save();

    return res.status(200).json(new ApiResponse(200,AIReply,"Response Returned Successfully"));
});

const getUserChatHistory =  asyncHandler(async(req,res,next)=>{
    const userId = req.user.id;
    const farmerScans = await History.find({userId}).select('-chatLog').sort({ createdAt: -1 });
    return res.status(200).json(new ApiResponse(200,farmerScans,"History Retrieved Successfully"));
});


const getChatHistory = asyncHandler(async(req,res,next)=>{
    const userId = req.user.id;
    const chatRecord = await History.findOne({
        _id:req.params.recordId,
        userId
    });
    if(!chatRecord){
       throw new NotFoundError("Could not Find Chat History");
    }
    return res.status(201).json(new ApiResponse(200,chatRecord,"Chat Record Fetched Successfully"));
});



export { diagnoseCrop,chatWithAI,getUserChatHistory,getChatHistory};