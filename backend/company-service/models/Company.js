import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: String,
  role: String,
  package: Number,
  reqskills: [String],
  mincgpa: Number,
  description: String,
  location: String,
  lastDate: Date
});

export default mongoose.model("Company", companySchema);
