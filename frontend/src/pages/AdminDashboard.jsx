import React from 'react'
import DashboardSidebar from '../components/DashboardSidebar'
import { useAuth } from '../context/AuthContext'

const AdminDashboard = () => {
  const { user } = useAuth()

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar userRole="admin" />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mb-8">
            System management and monitoring
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Total Users</h3>
              <p className="text-3xl font-bold text-primary">1,247</p>
              <p className="text-gray-600">Registered</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Pending Approvals</h3>
              <p className="text-3xl font-bold text-secondary">12</p>
              <p className="text-gray-600">Doctor applications</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">System Health</h3>
              <p className="text-3xl font-bold text-accent">100%</p>
              <p className="text-gray-600">Operational</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">New patient registered</p>
                    <p className="text-gray-600 text-sm">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Doctor application submitted</p>
                    <p className="text-gray-600 text-sm">1 hour ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Medical record uploaded</p>
                    <p className="text-gray-600 text-sm">3 hours ago</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full bg-primary text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Manage Doctors
                </button>
                <button className="w-full bg-secondary text-white py-2 rounded-lg hover:bg-green-600 transition-colors">
                  View System Logs
                </button>
                <button className="w-full bg-accent text-white py-2 rounded-lg hover:bg-purple-600 transition-colors">
                  Department Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard