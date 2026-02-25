import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "student" },
});

// Register the model if it doesn't exist
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
