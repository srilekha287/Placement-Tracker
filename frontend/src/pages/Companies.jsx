import { useEffect, useState } from "react";
import API from "../api/api";
import DashboardLayout from "../layouts/DashboardLayout";

export default function Companies() {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    API.get("/company").then((res) => setCompanies(res.data));
  }, []);

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-6">Companies</h2>

      {companies.map((c) => (
        <div key={c._id} className="bg-white p-4 mb-4 rounded-xl shadow">
          <h3 className="font-semibold">{c.name}</h3>
          <p>{c.role}</p>
          <p className="text-indigo-600">{c.package}</p>
        </div>
      ))}
    </DashboardLayout>
  );
}