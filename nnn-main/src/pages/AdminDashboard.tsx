import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  Users,
  Building2,
  UserCheck,
  Clock,
  LogOut,
  CheckCircle,
  XCircle,
  BarChart,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isDepartmentAdmin = user?.role === 'department-admin';

  const mockDoctors = [
    {
      id: '1',
      name: 'Dr. James Wilson',
      specialty: 'Cardiology',
      email: 'james.wilson@hospital.com',
      status: 'pending',
      department: 'Cardiology',
    },
    {
      id: '2',
      name: 'Dr. Lisa Anderson',
      specialty: 'Dermatology',
      email: 'lisa.anderson@hospital.com',
      status: 'pending',
      department: 'Dermatology',
    },
  ];

  const mockApprovedDoctors = [
    {
      id: '3',
      name: 'Dr. Sarah Johnson',
      specialty: 'General Practice',
      email: 'sarah.j@hospital.com',
      status: 'approved',
      department: 'General',
    },
  ];

  const mockDepartments = [
    { id: '1', name: 'Cardiology', doctors: 5, patients: 120 },
    { id: '2', name: 'Radiology', doctors: 3, patients: 80 },
    { id: '3', name: 'Pediatrics', doctors: 4, patients: 150 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Activity className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                MediChain
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-semibold">{user?.name}</p>
                <p className="text-xs text-gray-500">
                  {isDepartmentAdmin ? `${user.department} Admin` : 'Super Admin'}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-64 space-y-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'overview'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Activity className="h-5 w-5" />
              <span>Overview</span>
            </button>
            {!isDepartmentAdmin && (
              <button
                onClick={() => setActiveTab('departments')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'departments'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Building2 className="h-5 w-5" />
                <span>Departments</span>
              </button>
            )}
            <button
              onClick={() => setActiveTab('doctors')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'doctors'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <UserCheck className="h-5 w-5" />
              <span>Doctor Approvals</span>
            </button>
            <button
              onClick={() => setActiveTab('patients')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'patients'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Users className="h-5 w-5" />
              <span>Register Patient</span>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'analytics'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <BarChart className="h-5 w-5" />
              <span>Analytics</span>
            </button>
          </aside>

          <main className="flex-1">
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    {isDepartmentAdmin
                      ? `${user?.department} Department Overview`
                      : 'System Overview'}
                  </h1>
                  <p className="text-gray-600">Manage and monitor the healthcare system</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {!isDepartmentAdmin && (
                    <div className="bg-white p-6 rounded-xl shadow-md">
                      <div className="flex items-center justify-between mb-2">
                        <Building2 className="h-8 w-8 text-blue-600" />
                        <span className="text-3xl font-bold">{mockDepartments.length}</span>
                      </div>
                      <p className="text-gray-600">Active Departments</p>
                    </div>
                  )}

                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <div className="flex items-center justify-between mb-2">
                      <Clock className="h-8 w-8 text-yellow-600" />
                      <span className="text-3xl font-bold">{mockDoctors.length}</span>
                    </div>
                    <p className="text-gray-600">Pending Doctor Approvals</p>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <div className="flex items-center justify-between mb-2">
                      <Users className="h-8 w-8 text-green-600" />
                      <span className="text-3xl font-bold">{mockApprovedDoctors.length}</span>
                    </div>
                    <p className="text-gray-600">Approved Doctors</p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                        <div>
                          <p className="font-semibold">Doctor Approved</p>
                          <p className="text-sm text-gray-600">Dr. Sarah Johnson - General Practice</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">2 hours ago</span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Users className="h-6 w-6 text-blue-600" />
                        <div>
                          <p className="font-semibold">New Patient Registered</p>
                          <p className="text-sm text-gray-600">Patient ID: did:hedera:0.0.78901</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">5 hours ago</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'departments' && !isDepartmentAdmin && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h1 className="text-3xl font-bold">Departments</h1>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Add Department
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {mockDepartments.map((dept) => (
                    <div key={dept.id} className="bg-white p-6 rounded-xl shadow-md">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold">{dept.name}</h3>
                        </div>
                        <Building2 className="h-8 w-8 text-blue-600" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Doctors:</span>
                          <span className="font-semibold">{dept.doctors}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Patients:</span>
                          <span className="font-semibold">{dept.patients}</span>
                        </div>
                      </div>
                      <button className="w-full mt-4 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                        Manage
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'doctors' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h1 className="text-3xl font-bold">Doctor Approvals</h1>

                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h2 className="text-xl font-bold mb-4">Pending Approvals</h2>
                  <div className="space-y-4">
                    {mockDoctors
                      .filter(
                        (doc) => !isDepartmentAdmin || doc.department === user?.department
                      )
                      .map((doctor) => (
                        <div
                          key={doctor.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                          <div>
                            <p className="font-semibold">{doctor.name}</p>
                            <p className="text-sm text-gray-600">{doctor.specialty}</p>
                            <p className="text-xs text-gray-500 mt-1">{doctor.email}</p>
                            <p className="text-xs text-blue-600 mt-1">
                              Department: {doctor.department}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-1">
                              <CheckCircle className="h-4 w-4" />
                              <span>Approve</span>
                            </button>
                            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-1">
                              <XCircle className="h-4 w-4" />
                              <span>Reject</span>
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h2 className="text-xl font-bold mb-4">Approved Doctors</h2>
                  <div className="space-y-4">
                    {mockApprovedDoctors
                      .filter(
                        (doc) => !isDepartmentAdmin || doc.department === user?.department
                      )
                      .map((doctor) => (
                        <div
                          key={doctor.id}
                          className="flex items-center justify-between p-4 bg-green-50 rounded-lg"
                        >
                          <div>
                            <p className="font-semibold">{doctor.name}</p>
                            <p className="text-sm text-gray-600">{doctor.specialty}</p>
                            <p className="text-xs text-gray-500 mt-1">{doctor.email}</p>
                          </div>
                          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                            Revoke Access
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'patients' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h1 className="text-3xl font-bold">Register New Patient</h1>

                <div className="bg-white p-8 rounded-xl shadow-md">
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                          placeholder="John Doe"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Age
                        </label>
                        <input
                          type="number"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                          placeholder="25"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                          placeholder="+254 712 345 678"
                        />
                      </div>
                    </div>

                    {isDepartmentAdmin && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Department
                        </label>
                        <input
                          type="text"
                          value={user?.department}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                          readOnly
                        />
                      </div>
                    )}

                    {!isDepartmentAdmin && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Assign to Department
                        </label>
                        <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent">
                          <option>Select department...</option>
                          {mockDepartments.map((dept) => (
                            <option key={dept.id} value={dept.id}>
                              {dept.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Initial Diagnosis (Optional)
                      </label>
                      <textarea
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        placeholder="Enter initial diagnosis or notes..."
                      ></textarea>
                    </div>

                    <button className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                      Register Patient on Hedera
                    </button>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-700">
                        <strong>Note:</strong> A unique Hedera DID will be generated for the patient
                        upon registration. Login credentials will be sent to their email.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'analytics' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h1 className="text-3xl font-bold">
                  {isDepartmentAdmin ? `${user?.department} Analytics` : 'System Analytics'}
                </h1>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-lg font-bold mb-4">Records by Type</h3>
                    <div className="space-y-3">
                      {[
                        { type: 'Lab Results', count: 45, color: 'bg-blue-600' },
                        { type: 'Prescriptions', count: 32, color: 'bg-green-600' },
                        { type: 'Imaging', count: 18, color: 'bg-yellow-600' },
                        { type: 'Diagnoses', count: 25, color: 'bg-red-600' },
                      ].map((item) => (
                        <div key={item.type}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">{item.type}</span>
                            <span className="text-sm text-gray-600">{item.count}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`${item.color} h-2 rounded-full`}
                              style={{ width: `${(item.count / 45) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-lg font-bold mb-4">Monthly Activity</h3>
                    <div className="h-48 flex items-end justify-between space-x-2">
                      {[40, 65, 55, 70, 45, 85, 60].map((height, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-gradient-to-t from-blue-600 to-teal-500 rounded-t-lg"
                          style={{ height: `${height}%` }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
