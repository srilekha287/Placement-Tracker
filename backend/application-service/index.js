import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import "./models/User.js"; // Register User model before any other models
import applicationRoutes from "./routes/applicationRoutes.js";

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI);

app.use("/application", applicationRoutes);

app.listen(5004, () => console.log("Application service running"));