import { ApiError } from "../utils/ApiError.utils.js";

const errorMiddleware = (err,req,res,next)=>{
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";
    let errors = err.errors || [];

    //MongoDB Duplicate Key Error
    if(err.code === 11000){
        statusCode = 409;
        message = "Duplicate Field Value entered";
    }
    // Mongoose Validation Error
    if(err.name === "ValidationError"){
        statusCode = 422,
        errors = Object.values(err.errors).map(val=>val.message);
    }
    // Unknown Errors
    if(!(err instanceof ApiError)){
        statusCode = 500;
        message = "Internal Server Error";
        errors = [];
    }

    res.status(statusCode).json({
        success:false,
        message,
        errors
    });
};

export default errorMiddleware;