import express from "express";
import Application from "../models/Application.js";
import Student from "../../student-service/models/Student.js";
import Company from "../../company-service/models/Company.js";
import { protect } from "../../auth-service/middleware/authMiddleware.js";
import { 
  applyJob, 
  updateStatus,
  getStudentApplications,
  getCompanyApplications,
  getStudentStats,
  updateApplicationStatus,
  getAdminStats
} from "../controllers/applicationController.js";

const router = express.Router();

router.post("/apply", protect, applyJob);


router.post("/", async (req, res) => {
  const a = await Application.create(req.body);
  res.json(a);
});

// /me must come FIRST before any parameterized routes
router.get("/me", protect, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized - no user info" });
    }
    const student = await Student.findOne({ userId: req.user.id });
    if (!student) {
      return res.status(404).json({ message: "Student profile not found. Please complete your student profile first." });
    }
    const apps = await Application.find({ studentId: student._id }).populate("companyId");
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get("/admin/stats", protect, getAdminStats);

router.get("/student/:studentId", getStudentApplications);
router.get("/company/:companyId", getCompanyApplications);
router.get("/stats/:studentId", getStudentStats);

router.get("/:studentId", async (req, res) => {
  const apps = await Application.find({
    studentId: req.params.studentId,
  }).populate("companyId");
  res.json(apps);
});

router.put("/status/:id", protect, updateStatus);
router.put("/update/:id", protect, updateApplicationStatus);

export default router;
