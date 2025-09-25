import React from 'react'
import DashboardSidebar from '../components/DashboardSidebar'
import { useAuth } from '../context/AuthContext'

const PatientDashboard = () => {
  const { user } = useAuth()

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar userRole="patient" />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name || 'Patient'}!
          </h1>
          <p className="text-gray-600 mb-8">
            Here's your medical dashboard
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Medical Records</h3>
              <p className="text-3xl font-bold text-primary">12</p>
              <p className="text-gray-600">Total records</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Pending Access</h3>
              <p className="text-3xl font-bold text-secondary">3</p>
              <p className="text-gray-600">Requests waiting</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Recent Activity</h3>
              <p className="text-3xl font-bold text-accent">5</p>
              <p className="text-gray-600">This week</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Medical Records</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-semibold">Blood Test Results</h4>
                  <p className="text-gray-600">Lab Report • 2 days ago</p>
                </div>
                <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  View
                </button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-semibold">X-Ray Scan</h4>
                  <p className="text-gray-600">Imaging • 1 week ago</p>
                </div>
                <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  View
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PatientDashboard