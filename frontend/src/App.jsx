import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Companies from "./pages/Companies";
import StudentDashboard from "./pages/StudentDashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import EditProfile from "./pages/EditProfile";
import AppliedJobs from "./pages/AppliedJobs";
import RecruiterCompanies from "./pages/RecruiterCompanies";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/recruiter-dashboard" element={<RecruiterDashboard />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/applied-jobs" element={<AppliedJobs />} />
        <Route path="/recruiter-companies" element={<RecruiterCompanies />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
