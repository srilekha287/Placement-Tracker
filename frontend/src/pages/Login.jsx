import { useState } from "react";
import API from "../api/api";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/auth/login", form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user?.role || "student");
      alert("Login successful");
      
      const userRole = data.user?.role;
      if (userRole === "student") navigate("/student-dashboard");
      else if (userRole === "recruiter") navigate("/recruiter-dashboard");
      else if (userRole === "admin") navigate("/admin-dashboard");
      else navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={submit}
        className="bg-white p-8 rounded-2xl shadow-xl w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Student Placement Login
        </h2>

        <input
          className="w-full border p-3 mb-4 rounded-lg"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          className="w-full border p-3 mb-4 rounded-lg"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors">
          Login
        </button>

        <p className="mt-4 text-center">
          Don't have an account? <Link to="/register" className="text-indigo-600">Register</Link>
        </p>
      </form>
    </div>
  );
}
