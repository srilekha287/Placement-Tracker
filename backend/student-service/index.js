import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import "./models/User.js"; // Register User model before any other models
import studentRoutes from "./routes/studentRoutes.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

try{
    mongoose.connect(process.env.MONGO_URI);
    console.log("DB connected successfully");
}
catch(err){
    console.log(err.message)
}

app.use("/student", studentRoutes);

app.listen(5002, () => console.log("Student service running"));
