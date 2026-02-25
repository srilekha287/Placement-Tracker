import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";

export default function RecruiterDashboard() {
  const [companies, setCompanies] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    role: "",
    package: "",
    mincgpa: "",
    reqskills: "",
  });
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem("token");
      const userRes = await API.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const res = await API.get(`/company/recruiter/${userRes.data._id}`);
      setCompanies(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddCompany = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const userRes = await API.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const companyData = {
        ...form,
        recruiterId: userRes.data._id,
        reqskills: form.reqskills.split(",").map((s) => s.trim()),
      };

      await API.post("/company", companyData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Company added successfully!");
      setShowAddForm(false);
      fetchCompanies();
    } catch (err) {
      alert(err.response?.data?.message || "Error adding company");
    }
  };

  const handleDelete = async (companyId) => {
    if (!window.confirm("Are you sure you want to delete this company?")) return;
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/company/${companyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Company deleted!");
      fetchCompanies();
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting company");
    }
  };

  const handleEdit = (company) => {
    setForm({
      name: company.name,
      role: company.role,
      package: company.package,
      mincgpa: company.mincgpa,
      reqskills: company.reqskills?.join(", ") || "",
    });
    setSelectedCompany(company);
    setShowAddForm(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await API.put(`/company/${selectedCompany._id}`, {
        ...form,
        reqskills: form.reqskills.split(",").map((s) => s.trim()),
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Company updated!");
      setShowAddForm(false);
      setSelectedCompany(null);
      fetchCompanies();
    } catch (err) {
      alert(err.response?.data?.message || "Error updating company");
    }
  };

  const viewApplicants = async (companyId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get(`/application/company/${companyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplicants(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Error fetching applicants");
    }
  };

  const updateStatus = async (applicationId, status) => {
    try {
      const token = localStorage.getItem("token");
      await API.put(`/application/update/${applicationId}`, { status }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(`Student ${status}!`);
      viewApplicants(applicants[0]?.companyId || selectedCompany?._id);
    } catch (err) {
      alert(err.response?.data?.message || "Error updating status");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-indigo-900 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Recruiter Dashboard</h1>
          <div className="flex gap-4">
            <button
              onClick={() => {
                setShowAddForm(true);
                setSelectedCompany(null);
                setForm({ name: "", role: "", package: "", mincgpa: "", reqskills: "" });
              }}
              className="bg-indigo-600 px-4 py-2 rounded-lg hover:bg-Indigo-400"
            >
              Add Company
            </button>
            <button onClick={handleLogout} className="bg-indigo-500 px-4 py-2 rounded-lg hover:bg-Indigo-700">
              Logout
            </button>
          </div>
        </div>
      </nav>

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {selectedCompany ? "Edit Company" : "Add New Company"}
            </h2>
            <form onSubmit={selectedCompany ? handleUpdate : handleAddCompany} className="space-y-4">
              <input
                type="text"
                placeholder="Company Name"
                className="w-full border p-3 rounded-lg"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Role"
                className="w-full border p-3 rounded-lg"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Package (in LPA)"
                className="w-full border p-3 rounded-lg"
                value={form.package}
                onChange={(e) => setForm({ ...form, package: e.target.value })}
                required
              />
              <input
                type="number"
                step="0.1"
                placeholder="Minimum CGPA"
                className="w-full border p-3 rounded-lg"
                value={form.mincgpa}
                onChange={(e) => setForm({ ...form, mincgpa: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Required Skills (comma separated)"
                className="w-full border p-3 rounded-lg"
                value={form.reqskills}
                onChange={(e) => setForm({ ...form, reqskills: e.target.value })}
                required
              />
              <div className="flex gap-4">
                <button type="submit" className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700">
                  {selectedCompany ? "Update" : "Add"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setSelectedCompany(null);
                  }}
                  className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {applicants.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Applicants</h2>
              <button onClick={() => setApplicants([])} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <div className="space-y-4">
              {applicants.map((app) => (
                <div key={app._id} className="border p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold">{app.studentId?.name || "Unknown"}</h3>
                      <p className="text-sm text-gray-600">Role: {app.studentId?.role}</p>
                      <p className="text-sm text-gray-600">CGPA: {app.studentId?.cgpa}</p>
                      <p className="text-sm text-gray-600">Skills: {app.studentId?.skills?.join(", ")}</p>
                      {app.studentId?.resume && (
                        <a href={app.studentId.resume} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline text-sm">
                          View Resume
                        </a>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        app.status === "selected" ? "bg-green-100 text-green-800" :
                        app.status === "rejected" ? "bg-red-100 text-red-800" :
                        "bg-yellow-100 text-yellow-800"
                      }`}>
                        {app.status || "pending"}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateStatus(app._id, "selected")}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        >
                          Select
                        </button>
                        <button
                          onClick={() => updateStatus(app._id, "rejected")}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto p-8">
        <h2 className="text-xl font-bold mb-6">My Companies</h2>
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
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => {
                    viewApplicants(company._id);
                    setSelectedCompany(company);
                  }}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  View Applicants
                </button>
              </div>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => handleEdit(company)}
                  className="flex-1 bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(company._id)}
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
