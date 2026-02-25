import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";

export default function EditProfile() {
  const [form, setForm] = useState({
    fullname: "",
    cgpa: "",
    skills: "",
    role: "",
  });
  const [resume, setResume] = useState(null);
  const [studentId, setStudentId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      const token = localStorage.getItem("token");
      const userRes = await API.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userId = userRes.data._id;

      const studentRes = await API.get(`/student/user/${userId}`);
      if (studentRes.data) {
        setStudentId(studentRes.data._id);
        setForm({
          fullname: studentRes.data.fullname || "",
          cgpa: studentRes.data.cgpa || "",
          skills: studentRes.data.skills?.join(", ") || "",
          role: studentRes.data.role || "",
        });
      }
    } catch (err) {
      console.error(err);
      alert("Please login first");
      navigate("/");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      if (!studentId) return;

      const token = localStorage.getItem("token");
      
      // Always send as JSON for proper API Gateway parsing
      const data = {
        fullname: form.fullname,
        cgpa: parseFloat(form.cgpa),
        skills: form.skills.split(",").map((s) => s.trim()),
        role: form.role,
      };

      await API.put(`/student/update`, data, {
        headers: { 
          Authorization: `Bearer ${token}`
        }
      });

      alert("Profile updated successfully!");
      navigate("/student-dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Error updating profile");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Edit Profile</h2>
          <Link to="/student-dashboard" className="text-indigo-600 hover:underline">
            Back to Dashboard
          </Link>
        </div>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              className="w-full border p-3 rounded-lg"
              value={form.fullname}
              onChange={(e) => setForm({ ...form, fullname: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">CGPA (0.0 - 10.0)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              className="w-full border p-3 rounded-lg"
              value={form.cgpa}
              onChange={(e) => setForm({ ...form, cgpa: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Skills (comma separated)</label>
            <input
              type="text"
              placeholder="Python, JavaScript, React"
              className="w-full border p-3 rounded-lg"
              value={form.skills}
              onChange={(e) => setForm({ ...form, skills: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Role You Want</label>
            <input
              type="text"
              className="w-full border p-3 rounded-lg"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Resume (PDF) - Optional</label>
            <input
              type="file"
              accept=".pdf"
              className="w-full border p-3 rounded-lg"
              onChange={(e) => setResume(e.target.files[0])}
            />
          </div>
          <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700">
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
}
