import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./db/connectDB.js";
import { v2 as cloudinary } from "cloudinary";
import userRouter from "./Routes/Route.router.js";

dotenv.config();
connectDB();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});


const app = express();
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));  
app.use(express.urlencoded({ extended: true }));


app.use("/api/user",userRouter);

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log("Server started on port " + PORT);
})