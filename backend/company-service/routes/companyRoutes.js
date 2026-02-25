import express from "express";
import Company from "../models/Company.js";
import { protect } from "../../auth-service/middleware/authMiddleware.js";
import { 
  getCompanies, 
  createCompany, 
  updateCompany, 
  deleteCompany,
  getCompanyApplicants,
  getAllCompanies 
} from "../controller/companyController.js";

const router = express.Router();

router.get("/all", getAllCompanies);
router.get("/", getAllCompanies);
router.get("/recruiter/:id", protect, getCompanies);
router.post("/", protect, createCompany);
router.put("/:id", protect, updateCompany);
router.delete("/:id", protect, deleteCompany);
router.get("/:id/applicants", protect, getCompanyApplicants);

export default router;
