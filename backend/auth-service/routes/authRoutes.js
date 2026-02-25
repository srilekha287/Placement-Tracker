import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try{
  const { name, email, password,role } = req.body;

  const exists = await User.findOne({ email });
  if (exists)
    return res.status(400).json({ message: "User already exists" });
    const hash = await bcrypt.hash(password, 10);

  await User.create({ name, email, password: hash ,role});

  res.json({ message: "Registered" });
  }
  catch(err){
    console.log(err.message);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return res.status(400).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok)
    return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    "secret"
  );

  res.json({ token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
});

router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token" });
    
    const decoded = jwt.verify(token, "secret");
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    
    res.json(user);
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

export default router;
