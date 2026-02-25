import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

try{
    mongoose.connect(process.env.MONGO_URI);
    console.log("DB connected successfully");
}
catch(err){
    console.log(err.message)
}

app.use("/auth", authRoutes);

app.listen(5001, () => console.log("Auth service running"));