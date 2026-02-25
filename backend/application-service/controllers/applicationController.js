import Application from "../models/Application.js";
import Student from "../../student-service/models/Student.js";
import Company from "../../company-service/models/Company.js";

export const applyJob = async (req, res) => {
  const { companyId } = req.body;
  
  // Get studentId from authenticated user via Student collection
  const student = await Student.findOne({ userId: req.user.id });
  if (!student) {
    return res.status(404).json({ message: "Student profile not found. Please complete your student profile first." });
  }

  // Check if already applied
  const existing = await Application.findOne({ studentId: student._id, companyId });
  if (existing) {
    return res.status(400).json({ message: "Already applied to this company" });
  }

  const app = await Application.create({
    studentId: student._id,
    companyId,
    isApplied: true,
    status: "pending",
    interview: false,
  });

  res.json(app);
};

export const updateStatus = async (req, res) => {
  const app = await Application.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(app);
};

export const getStudentApplications = async (req, res) => {
  try {
    const applications = await Application.find({ studentId: req.params.studentId })
      .populate("companyId");
    res.json(applications);
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCompanyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ companyId: req.params.companyId })
      .populate("studentId");
    res.json(applications);
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
};

export const getStudentStats = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    
    const applied = await Application.countDocuments({ studentId, isApplied: true });
    const selected = await Application.countDocuments({ studentId, status: "selected" });
    const rejected = await Application.countDocuments({ studentId, status: "rejected" });
    const pending = await Application.countDocuments({ studentId, status: "pending" });

    res.json({
      applied,
      selected,
      rejected,
      pending
    });
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("studentId");

    res.json(application);
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: Get all statistics
export const getAdminStats = async (req, res) => {
  try {
    const Company = (await import("../../company-service/models/Company.js")).default;
    const companies = await Company.find().populate("recruiterId", "name email");
    
    const applications = await Application.find()
      .populate("studentId", "fullname userId")
      .populate("companyId", "name role package");
    
    const totalApplications = applications.length;
    const totalSelected = applications.filter(app => app.status === "selected").length;
    const totalRejected = applications.filter(app => app.status === "rejected").length;
    const totalPending = applications.filter(app => app.status === "pending").length;
    
    const applicationsByCompany = companies.map(company => {
      const companyApps = applications.filter(app => 
        app.companyId && app.companyId._id.toString() === company._id.toString()
      );
      return {
        company: {
          _id: company._id,
          name: company.name,
          role: company.role,
          package: company.package,
          recruiter: company.recruiterId?.name || "Unknown"
        },
        totalApplications: companyApps.length,
        selected: companyApps.filter(app => app.status === "selected").length,
        rejected: companyApps.filter(app => app.status === "rejected").length,
        pending: companyApps.filter(app => app.status === "pending").length,
        applicants: companyApps.map(app => ({
          _id: app._id,
          studentName: app.studentId?.fullname || "Unknown",
          status: app.status,
          isApplied: app.isApplied,
          appliedAt: app.createdAt
        }))
      };
    });

    res.json({
      summary: {
        totalCompanies: companies.length,
        totalApplications,
        totalSelected,
        totalRejected,
        totalPending
      },
      companies: applicationsByCompany
    });
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
};
