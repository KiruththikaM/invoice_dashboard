const Dashboard = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h2>
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold mb-2">Welcome back, Kiruthika!</h3>
        <p className="text-gray-600">Select <span className="font-medium text-indigo-600">Invoices</span> from the sidebar to view your invoice management table.</p>
      </div>
    </div>
  );
};

export default Dashboard;
