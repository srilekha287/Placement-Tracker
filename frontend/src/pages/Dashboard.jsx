import DashboardLayout from "../layouts/DashboardLayout";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">Welcome Student</h1>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3>Applied</h3>
          <p className="text-2xl font-bold">5</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3>Interviews</h3>
          <p className="text-2xl font-bold">2</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3>Offers</h3>
          <p className="text-2xl font-bold">1</p>
        </div>
      </div>
    </DashboardLayout>
  );
}