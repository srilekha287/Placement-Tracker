import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";

export default function StudentDashboard() {
  const [student, setStudent] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    cgpa: "",
    skills: "",
    role: "",
    resume: null
  });
  const navigate = useNavigate();

  useEffect(() => {
    checkStudentProfile();
    fetchCompanies();
    fetchAppliedJobs();
  }, []);

  const checkStudentProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }
      
      try {
        const { data } = await API.get("/student/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStudent(data);
        setShowForm(false);
      } catch (err) {
        setShowForm(true);
      }
    } catch (err) {
      alert("Please login first");
      navigate("/");
    }
  };

  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/company", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCompanies(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAppliedJobs = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/application/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppliedJobs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      
      let skillsArray;
      if (typeof formData.skills === 'string') {
        skillsArray = formData.skills.split(',').map(s => s.trim());
      } else {
        skillsArray = formData.skills;
      }

      // Send as JSON instead of FormData for proper parsing
      const dataToSend = {
        name: formData.name,
        cgpa: parseFloat(formData.cgpa),
        skills: skillsArray,
        role: formData.role
      };

      await API.post("/student/create", dataToSend, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Profile created successfully!");
      checkStudentProfile();
    } catch (err) {
      alert(err.response?.data?.message || "Error creating profile");
    }
  };

  const applyToJob = async (companyId) => {
    try {
      const token = localStorage.getItem("token");
      // Use /apply endpoint which has protect middleware to auto-get studentId
      await API.post("/application/apply", { companyId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Applied successfully!");
      fetchAppliedJobs();
    } catch (err) {
      alert(err.response?.data?.message || "Error applying to job");
    }
  };

  const isApplied = (companyId) => {
    return appliedJobs.some(app => 
      app.companyId && (app.companyId._id === companyId || app.companyId === companyId)
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-indigo-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Student Dashboard</h1>
          <div className="flex gap-4">
            <Link to="/edit-profile" className="bg-blue-400 px-4 py-2 rounded-lg hover:bg-blue-500">
              Edit Profile
            </Link>
            <Link to="/applied-jobs" className="bg-indigo-800 px-4 py-2 rounded-lg hover:bg-indigo-400">
              Applied Jobs
            </Link>
            <button onClick={handleLogout} className="bg-indigo-800 px-4 py-2 rounded-lg hover:bg-indigo-400">
              Logout
            </button>
          </div>
        </div>
      </nav>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Complete Your Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full border p-3 rounded-lg"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <input
                type="number"
                step="0.1"
                placeholder="CGPA"
                className="w-full border p-3 rounded-lg"
                value={formData.cgpa}
                onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Skills (comma separated)"
                className="w-full border p-3 rounded-lg"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Role/Designation"
                className="w-full border p-3 rounded-lg"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Resume (PDF)</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="w-full border p-2 rounded-lg"
                  onChange={(e) => setFormData({ ...formData, resume: e.target.files[0] })}
                />
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700">
                Submit Profile
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="container mx-auto p-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Your Profile</h2>
          {student ? (
            <div className="space-y-2">
              <p><span className="font-medium">Name</span> {student.fullname}</p>
              <p><span className="font-medium">CGPA</span> {student.cgpa}</p>
              <p><span className="font-medium">Role</span> {student.role}</p>
              <p><span className="font-medium">Skills </span> {student.skills?.join(", ")}</p>
              {student.resume && (
                <a href={student.resume} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                  View Resume
                </a>
              )}
            </div>
          ) : (
            <p className="text-gray-500">No profile found</p>
          )}
        </div>

        <h2 className="text-2xl font-bold mb-6">Available Companies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <div key={company._id} className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold">{company.name}</h3>
              <p className="text-gray-600">{company.role}</p>
              <div className="mt-4 space-y-2">
                <p><span className="font-medium">Package:</span> ₹{company.package}L</p>
                <p><span className="font-medium">Min CGPA:</span> {company.mincgpa}</p>
                <p><span className="font-medium">Skills:</span> {company.reqskills?.join(", ")}</p>
              </div>
              {isApplied(company._id) ? (
                <button
                  disabled
                  className="w-full mt-4 bg-gray-400 text-white py-2 rounded-lg cursor-not-allowed"
                >
                  Applied
                </button>
              ) : (
                <button
                  onClick={() => applyToJob(company._id)}
                  className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
                >
                  Apply Now
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
