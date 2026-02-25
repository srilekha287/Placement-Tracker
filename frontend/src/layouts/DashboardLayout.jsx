
export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-indigo-700 text-white p-6">
        <h2 className="text-xl font-bold mb-6">Placement Tracker</h2>

        <nav className="space-y-3">
          <a href="/dashboard">Dashboard</a>
          <a href="/companies">Companies</a>
        </nav>
      </aside>

      <main className="flex-1 p-6 bg-gray-100">{children}</main>
    </div>
  );
}