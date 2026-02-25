import { useState } from "react";
import API from "../api/api";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", form);
      alert("Registered successfully");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form className="bg-white p-8 rounded-2xl shadow-lg w-96" onSubmit={submit}>
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        <input
          placeholder="Name"
          className="w-full border p-3 mb-3 rounded-lg"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Email"
          className="w-full border p-3 mb-3 rounded-lg"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 mb-4 rounded-lg"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Role</label>
          <div className="flex gap-4">
            <label className="flex items-center cursor-pointer">
              <input 
                type="radio" 
                value="student" 
                name="role"
                className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                onChange={(e) => setForm({ ...form, role: e.target.value })} 
              />
              <span className="ml-2 text-sm text-gray-700">Student</span>
            </label>

            <label className="flex items-center cursor-pointer">
              <input 
                type="radio" 
                value="recruiter" 
                name="role"
                className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                onChange={(e) => setForm({ ...form, role: e.target.value })} 
              />
              <span className="ml-2 text-sm text-gray-700">Recruiter</span>
            </label>

            {/* <label className="flex items-center cursor-pointer">
              <input 
                type="radio" 
                value="admin" 
                name="role"
                className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                onChange={(e) => setForm({ ...form, role: e.target.value })} 
              />
              <span className="ml-2 text-sm text-gray-700">Admin</span>
            </label> */}
          </div>
        </div>
        
        <button className="w-full bg-indigo-600 text-white py-3 rounded-lg">
          Register
        </button>

        <p className="mt-4 text-center">
          Already have an account? <Link to="/" className="text-indigo-600">Login</Link>
        </p>
      </form>
    </div>
  );
}