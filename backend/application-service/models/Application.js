import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  isApplied: Boolean,
  status: String, 
  interview: Boolean
}, { timestamps: true });

export default mongoose.model("Application", applicationSchema);