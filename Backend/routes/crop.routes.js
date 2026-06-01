import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { uploadCropImage } from "../middleware/multer.middleware.js";
import { diagnoseCrop,chatWithAI,getUserChatHistory,getChatHistory} from "../controllers/crop.controller.js"

const router = express.Router();

router.post("/diagnose",authMiddleware,uploadCropImage,diagnoseCrop);
router.post("/chat/:recordId",authMiddleware,chatWithAI);
router.get("/history",authMiddleware,getUserChatHistory);
router.get("/history/:recordId",authMiddleware,getChatHistory);


export default router;