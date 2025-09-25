import React from 'react'
import DashboardSidebar from '../components/DashboardSidebar'

const DepartmentAdmin = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar userRole="admin" />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Department Administration
          </h1>
          <p className="text-gray-600 mb-8">
            Manage your department's doctors and patients
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Doctor Management</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">Dr. Sarah Wilson</h4>
                    <p className="text-gray-600">Cardiology • Pending Approval</p>
                  </div>
                  <div className="space-x-2">
                    <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors">
                      Approve
                    </button>
                    <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors">
                      Reject
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">Dr. Michael Brown</h4>
                    <p className="text-gray-600">Radiology • Active</p>
                  </div>
                  <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors">
                    Revoke
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Patient Statistics</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Total Patients:</span>
                  <span className="font-semibold">156</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Cases:</span>
                  <span className="font-semibold">23</span>
                </div>
                <div className="flex justify-between">
                  <span>Records This Month:</span>
                  <span className="font-semibold">47</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DepartmentAdmin