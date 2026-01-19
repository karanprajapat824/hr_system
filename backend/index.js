import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import AuthController from "./controllers/auth.js";
import UserController from "./controllers/user.js";
import AdminController from "./controllers/admin.js";
import User from "./models/user.js";
import Attendance from "./models/attendance.js";
import Leave from "./models/leave.js";


const app = express();
dotenv.config();

mongoose.connect(process.env.MONGODB_URL).then(() => {
    console.log("Database connected");
}).catch((err) => {
    console.log("Error in connecting database : " + err);
});

app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
app.use(cookieParser());

app.use("/auth", AuthController);
app.use("/user", UserController);
app.use("/admin", AdminController);

app.get("/",async (req,res)=>{
    res.json({message : "running"});
})

app.listen(process.env.PORT || 4040, () => {
    console.log("Server running on port number : " + process.env.PORT);
});