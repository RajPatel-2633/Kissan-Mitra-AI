import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import errorMiddleware from "./middleware/error.middleware.js";
import authRoutes from "./routes/auth.routes.js"
import db from "./utils/db.utils.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8080;

app.use(cors({
    origin:process.env.BASE_URL,
    credentials:true,
    allowedHeaders:["Content-Type","Authorization"],
    methods:["GET","PUT","POST","PATCH","DELETE"]
}));

app.use(express.json());
app.use(cookieParser());

db();
// Write all user defined routes here;
app.use("/api/v1/auth",authRoutes);

app.use(errorMiddleware);

app.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT}`);
});