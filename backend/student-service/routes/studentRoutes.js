import express from "express";
import Student from "../models/Student.js";
import { protect } from "../../auth-service/middleware/authMiddleware.js";
import { 
  checkStudent, 
  createStudent, 
  updateStudent, 
  getStudentProfile,
  getCompaniesForStudent,
  getStudentStats,
  getStudentByUserId
} from "../controller/studentController.js";

const router = express.Router();

router.get("/check", protect, checkStudent);
router.post("/create", protect, createStudent);
router.put("/update", protect, updateStudent);
router.get("/profile", protect, getStudentProfile);
router.get("/companies", protect, getCompaniesForStudent);
router.get("/stats", protect, getStudentStats);
router.get("/user/:userId", protect, getStudentByUserId);

export default router;
