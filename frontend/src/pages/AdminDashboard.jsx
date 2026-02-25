import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedCompany, setExpandedCompany] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      // Check if user is admin
      const user = JSON.parse(atob(token.split(".")[1]));
      if (user.role !== "admin") {
        alert("Access denied. Admin only.");
        navigate("/");
        return;
      }

      const res = await API.get("/application/admin/stats", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Error fetching stats");
      setLoading(false);
    }
  };

  const toggleCompany = (companyId) => {
    setExpandedCompany(expandedCompany === companyId ? null : companyId);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 shadow-lg">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="mt-2 text-indigo-100">Placement Statistics Overview</p>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="text-sm text-gray-500 uppercase font-semibold">Total Companies</div>
            <div className="text-3xl font-bold text-gray-800 mt-2">{stats?.summary?.totalCompanies || 0}</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="text-sm text-gray-500 uppercase font-semibold">Total Applications</div>
            <div className="text-3xl font-bold text-gray-800 mt-2">{stats?.summary?.totalApplications || 0}</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
            <div className="text-sm text-gray-500 uppercase font-semibold">Pending</div>
            <div className="text-3xl font-bold text-gray-800 mt-2">{stats?.summary?.totalPending || 0}</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-600">
            <div className="text-sm text-gray-500 uppercase font-semibold">Selected</div>
            <div className="text-3xl font-bold text-green-600 mt-2">{stats?.summary?.totalSelected || 0}</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
            <div className="text-sm text-gray-500 uppercase font-semibold">Rejected</div>
            <div className="text-3xl font-bold text-red-600 mt-2">{stats?.summary?.totalRejected || 0}</div>
          </div>
        </div>

        {/* Companies Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">Companies & Applications</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Package</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Recruiter</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Apps</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Pending</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Selected</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Rejected</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stats?.companies?.map((companyData, index) => (
                  <>
                    <tr key={companyData.company._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{companyData.company.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">{companyData.company.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">₹{companyData.company.package}L</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">{companyData.company.recruiter}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          {companyData.totalApplications}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                          {companyData.pending}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          {companyData.selected}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                          {companyData.rejected}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => toggleCompany(companyData.company._id)}
                          className="text-indigo-600 hover:text-indigo-900 font-medium text-sm"
                        >
                          {expandedCompany === companyData.company._id ? "Hide" : "View"} Applicants
                        </button>
                      </td>
                    </tr>
                    
                    {/* Expandable Applicants Row */}
                    {expandedCompany === companyData.company._id && (
                      <tr key={`${companyData.company._id}-applicants`}>
                        <td colSpan="9" className="px-6 py-4 bg-gray-50">
                          <div className="ml-4">
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Applicants List</h4>
                            {companyData.applicants.length > 0 ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {companyData.applicants.map((applicant) => (
                                  <div key={applicant._id} className="bg-white rounded-lg border border-gray-200 p-3">
                                    <div className="flex justify-between items-center">
                                      <span className="font-medium text-gray-800">{applicant.studentName}</span>
                                      <span className={`px-2 py-1 text-xs rounded-full ${
                                        applicant.status === 'selected' ? 'bg-green-100 text-green-800' :
                                        applicant.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                        'bg-yellow-100 text-yellow-800'
                                      }`}>
                                        {applicant.status}
                                      </span>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                      Applied: {new Date(applicant.appliedAt).toLocaleDateString()}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-500 text-sm">No applicants yet</p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
          
          {(!stats?.companies || stats.companies.length === 0) && (
            <div className="p-8 text-center text-gray-500">
              No companies found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
