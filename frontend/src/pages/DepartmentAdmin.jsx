import React from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardSidebar from '../components/DashboardSidebar';

const DepartmentAdmin = () => {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar userRole={user?.role} />
      <div className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Department Admin Dashboard</h1>
          <p className="text-gray-600">Manage your department</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Department Overview</h2>
          <p>This is the department admin view. Here you can manage doctors and patients within your department.</p>
        </div>
      </div>
    </div>
  );
};

export default DepartmentAdmin;