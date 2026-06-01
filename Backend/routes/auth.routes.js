import express from "express"
import {registerUser,loginUser,getProfile,forgotPassword,verifyOTP,resetPassword,updateProfile,logoutUser} from "../controllers/auth.controllers.js"
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("/profile",authMiddleware,getProfile);
router.post("/forgot-password",forgotPassword);
router.post("/verify-OTP",verifyOTP);
router.post("/reset-password",resetPassword);
router.patch("/update-profile",authMiddleware,updateProfile);
router.post("/logout",authMiddleware,logoutUser);

export default router;