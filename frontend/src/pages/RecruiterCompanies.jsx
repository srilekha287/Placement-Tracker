import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";

export default function RecruiterCompanies() {
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }
      const res = await API.get("/company", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCompanies(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.reqskills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-indigo-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">All Companies</h1>
          <Link
            to="/recruiter-dashboard"
            className="bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700"
          >
            My Companies
          </Link>
        </div>
      </nav>

      <div className="container mx-auto p-8">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search companies by name, role, or skills..."
            className="w-full border p-3 rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredCompanies.length === 0 ? (
          <div className="text-center text-gray-500">
            <p className="text-xl">No companies found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company) => (
              <div key={company._id} className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold">{company.name}</h3>
                <p className="text-gray-600">{company.role}</p>
                <div className="mt-4 space-y-2">
                  <p><span className="font-medium">Package:</span> ₹{company.package}L</p>
                  <p><span className="font-medium">Min CGPA:</span> {company.mincgpa}</p>
                  <p><span className="font-medium">Skills:</span> {company.reqskills?.join(", ")}</p>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500">
                    Posted by: {company.recruiterId?.name || "Unknown"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
