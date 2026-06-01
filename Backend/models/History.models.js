import mongoose, { Schema } from "mongoose"


const historySchema = new mongoose.Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    imageUrl: { 
        type: String, 
        required: true 
    },
    diseaseCode: { 
        type: String, 
        required: true 
    },
    displayName: { 
        type: String, 
        required: true 
    },
    confidence: { 
        type: Number, 
        required: true 
    },
    isHealthy: { 
        type: Boolean, 
        required: true 
    },
    chatLog: [
        {
            sender: { 
                type: String, 
                enum: ['farmer', 'ai'], 
                required: true 
            },
            message: { 
                type: String, 
                required: true 
            },
            timestamp: { 
                type: Date, 
                default: Date.now 
            }
        }
    ],
},{
    timestamps:true
});


const History = mongoose.model("History",historySchema);

export default History;