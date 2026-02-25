import Company from "../models/Company.js";
import Application from "../../application-service/models/Application.js";

export const getCompanies = async (req, res) => {
  const companies = await Company.find({
    recruiterId: req.user.id,
  });

  res.json(companies);
};

export const getAllCompanies = async (req, res) => {
  const companies = await Company.find().sort({ createdAt: -1 });
  res.json(companies);
};

export const createCompany = async (req, res) => {
  const company = await Company.create({
    recruiterId: req.user.id,
    ...req.body,
  });

  res.json(company);
};

export const updateCompany = async (req, res) => {
  try {
    const company = await Company.findOneAndUpdate(
      { _id: req.params.id, recruiterId: req.user.id },
      req.body,
      { new: true }
    );
    
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    
    res.json(company);
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteCompany = async (req, res) => {
  try {
    const company = await Company.findOneAndDelete({
      _id: req.params.id,
      recruiterId: req.user.id
    });
    
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    
    res.json({ message: "Company deleted successfully" });
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCompanyApplicants = async (req, res) => {
  try {
    const applications = await Application.find({
      companyId: req.params.id
    }).populate("studentId");

    res.json(applications);
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    res.json(company);
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
};
