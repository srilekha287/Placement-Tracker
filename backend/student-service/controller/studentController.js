import Student from "../models/Student.js";
import Company from "../../company-service/models/Company.js";
import Application from "../../application-service/models/Application.js";

export const checkStudent = async (req, res) => {
  // console.log("checkStudent - req.user:", req.user);
  const student = await Student.findOne({
    userId: req.user.id,
  });

  if (!student)
    return res.json({ newStudent: true });

  res.json({ student });
};

export const createStudent = async (req, res) => {
  // console.log("createStudent - req.body:", req.body);
  // console.log("createStudent - req.user:", req.user);
  
  const body = req.body || {};
  const { name, fullname, skills, ...rest } = body;
  
  let processedData = { ...rest };
  
  // Handle name -> fullname
  if (fullname) {
    processedData.fullname = fullname;
  } else if (name) {
    processedData.fullname = name;
  }
  
  // Handle skills - could be array or comma-separated string
  if (skills) {
    if (Array.isArray(skills)) {
      processedData.skills = skills;
    } else if (typeof skills === 'string') {
      processedData.skills = skills.split(',').map(s => s.trim());
    }
  }
  
  const student = await Student.create({
    userId: req.user.id,
    ...processedData,
    isProfileComplete: true
  });

  res.json(student);
};

export const updateStudent = async (req, res) => {
  console.log("updateStudent - req.body:", req.body);
  console.log("updateStudent - req.user:", req.user);
  
  const body = req.body || {};
  const { name, fullname, skills, ...rest } = body;
  
  const updateData = { ...rest };
  
  // Handle name -> fullname
  if (fullname) {
    updateData.fullname = fullname;
  } else if (name) {
    updateData.fullname = name;
  }
  
  // Handle skills - could be array or comma-separated string
  if (skills) {
    if (Array.isArray(skills)) {
      updateData.skills = skills;
    } else if (typeof skills === 'string') {
      updateData.skills = skills.split(',').map(s => s.trim());
    }
  }
  
  const student = await Student.findOneAndUpdate(
    { userId: req.user.id },
    updateData,
    { new: true, returnDocument: 'after' }
  );

  res.json(student);
};

export const getStudentProfile = async (req, res) => {
  console.log("getStudentProfile - req.user:", req.user);
  const student = await Student.findOne({ userId: req.user.id });
  
  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  res.json(student);
};

export const getStudentByUserId = async (req, res) => {
  console.log("getStudentByUserId - params:", req.params);
  const student = await Student.findOne({ userId: req.params.userId });
  
  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  res.json(student);
};

export const getCompaniesForStudent = async (req, res) => {
  const { role, minPackage, maxCgpa } = req.query;
  
  let query = {};
  
  if (role) {
    query.role = role;
  }
  
  if (minPackage) {
    query.package = { $gte: parseInt(minPackage) };
  }
  
  if (maxCgpa) {
    query.mincgpa = { $lte: parseFloat(maxCgpa) };
  }

  const companies = await Company.find(query).sort({ createdAt: -1 });
  res.json(companies);
};

export const getStudentStats = async (req, res) => {
  const student = await Student.findOne({ userId: req.user.id });
  
  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  const applications = await Application.find({ studentId: student._id });
  
  const appliedCount = applications.filter(app => app.isApplied).length;
  const selectedCount = applications.filter(app => app.status === "selected").length;
  const pendingCount = applications.filter(app => app.status === "pending").length;

  res.json({
    appliedCount,
    selectedCount,
    pendingCount,
    student
  });
};
