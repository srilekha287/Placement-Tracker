import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  fullname: String,
  cgpa: { type: Number, min: 0, max: 10 },
  skills: [String],
  role: String,
  resume: String,
  isProfileComplete: { type: Boolean, default: false }
});

export default mongoose.model("Student", studentSchema);
