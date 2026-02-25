import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import companyRoutes from "./routes/companyRoutes.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI);

app.use("/company", companyRoutes);

app.listen(5003, () => console.log("Company service running"));