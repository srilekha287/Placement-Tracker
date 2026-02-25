import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";

export default function AppliedJobs() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      // Use the /application/me endpoint which gets the currently logged-in student's applications
      const res = await API.get("/application/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(res.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 404) {
        // Student profile not found - this is OK, just show empty applications
        setApplications([]);
      } else {
        alert("Please login first");
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "selected":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-indigo-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Applied Jobs</h1>
          <Link to="/student-dashboard" className="hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </nav>

      <div className="container mx-auto p-8">
        {applications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <p className="text-gray-600">You haven't applied to any jobs yet.</p>
            <Link
              to="/student-dashboard"
              className="inline-block mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
            >
              Browse Companies
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app._id}
                className="bg-white rounded-xl shadow-lg p-6 flex justify-between items-center"
              >
                <div>
                  <h3 className="text-lg font-bold">
                    {app.companyId?.name || "Company"}
                  </h3>
                  <p className="text-gray-600">{app.companyId?.role}</p>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">Package:</span> ₹
                      {app.companyId?.package}L
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Applied Date:</span>{" "}
                      {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                      app.status
                    )}`}
                  >
                    {app.status || "Pending"}
                  </span>
                  {app.status === "selected" && (
                    <p className="mt-2 text-green-600 font-medium">
                      🎉 Congratulations! You got selected!
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
