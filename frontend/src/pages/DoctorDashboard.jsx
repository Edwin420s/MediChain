import React from 'react'
import DashboardSidebar from '../components/DashboardSidebar'
import { useAuth } from '../context/AuthContext'

const DoctorDashboard = () => {
  const { user } = useAuth()

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar userRole="doctor" />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dr. {user?.name || 'Doctor'}
          </h1>
          <p className="text-gray-600 mb-8">
            Patient management dashboard
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">My Patients</h3>
              <p className="text-3xl font-bold text-primary">24</p>
              <p className="text-gray-600">Under care</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Pending Requests</h3>
              <p className="text-3xl font-bold text-secondary">5</p>
              <p className="text-gray-600">Access requests</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Records Today</h3>
              <p className="text-3xl font-bold text-accent">8</p>
              <p className="text-gray-600">Reviewed</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Patient Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-semibold">John Smith</h4>
                  <p className="text-gray-600">Lab Results • 1 hour ago</p>
                </div>
                <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Review
                </button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-semibold">Sarah Johnson</h4>
                  <p className="text-gray-600">X-Ray • 3 hours ago</p>
                </div>
                <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Review
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorDashboard