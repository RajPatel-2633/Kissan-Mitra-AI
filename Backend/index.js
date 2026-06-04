import 'dotenv/config';
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middleware/error.middleware.js";
import authRoutes from "./routes/auth.routes.js"
import cropRoutes from "./routes/crop.routes.js"

import db from "./utils/db.utils.js";

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
app.use("/api/v1/crop",cropRoutes);

app.use(errorMiddleware);

app.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT}`);
});