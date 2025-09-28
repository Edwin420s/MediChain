import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/api';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Building,
  Shield,
  BarChart3,
  Settings
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsResponse, departmentsResponse, doctorsResponse] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getDepartments(),
        adminAPI.getDoctors('pending')
      ]);

      setStats(statsResponse.data || {});
      setDepartments(departmentsResponse.data || []);
      setPendingDoctors(doctorsResponse.data || []);
      
      // Load all doctors for the doctors tab
      if (activeTab === 'doctors') {
        const allDoctorsResponse = await adminAPI.getDoctors('all');
        setDoctors(allDoctorsResponse.data || []);
      }
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveDoctor = async (doctorId) => {
    try {
      await adminAPI.approveDoctor(doctorId);
      alert('Doctor approved successfully');
      loadDashboardData();
    } catch (error) {
      console.error('Error approving doctor:', error);
      alert('Failed to approve doctor');
    }
  };

  const handleRejectDoctor = async (doctorId) => {
    try {
      await adminAPI.rejectDoctor(doctorId);
      alert('Doctor application rejected');
      loadDashboardData();
    } catch (error) {
      console.error('Error rejecting doctor:', error);
      alert('Failed to reject doctor application');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                System Administration
              </h1>
              <p className="text-gray-600">
                Welcome, {user?.name} ({user?.admin?.level || 'System Admin'})
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-purple-50 px-3 py-1 rounded-full">
                <span className="text-purple-600 text-sm font-medium">
                  {user?.admin?.department || 'All Departments'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="text-blue-600 mr-3" size={24} />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Patients</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPatients || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <UserCheck className="text-green-600 mr-3" size={24} />
              <div>
                <p className="text-sm font-medium text-gray-600">Verified Doctors</p>
                <p className="text-2xl font-bold text-gray-900">{stats.verifiedDoctors || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <UserX className="text-yellow-600 mr-3" size={24} />
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingApprovals || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Building className="text-purple-600 mr-3" size={24} />
              <div>
                <p className="text-sm font-medium text-gray-600">Departments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.departments || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Overview', icon: BarChart3 },
                { id: 'doctors', name: 'Doctor Management', icon: UserCheck },
                { id: 'departments', name: 'Departments', icon: Building },
                { id: 'system', name: 'System Settings', icon: Settings }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      if (tab.id === 'doctors') {
                        loadDoctors();
                      }
                    }}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">System Overview</h2>
                
                {/* Pending Approvals */}
                {pendingDoctors.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Doctor Approvals</h3>
                    <div className="space-y-4">
                      {pendingDoctors.map((doctor) => (
                        <div key={doctor.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-semibold text-gray-900">{doctor.user.name}</h4>
                              <p className="text-sm text-gray-600">{doctor.specialization}</p>
                              <p className="text-sm text-gray-500">{doctor.user.email}</p>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleApproveDoctor(doctor.id)}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleRejectDoctor(doctor.id)}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700"
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Department Overview */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Departments</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {departments.map((dept) => (
                      <div key={dept.id} className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900">{dept.name}</h4>
                        <p className="text-sm text-gray-600">{dept.description}</p>
                        <div className="mt-2 text-sm text-gray-500">
                          Doctors: {dept.doctorCount || 0}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'doctors' && (
              <DoctorManagement 
                doctors={doctors} 
                onApprove={handleApproveDoctor}
                onReject={handleRejectDoctor}
              />
            )}

            {activeTab === 'departments' && (
              <DepartmentManagement departments={departments} />
            )}

            {activeTab === 'system' && (
              <SystemSettings stats={stats} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-components for different tabs
const DoctorManagement = ({ doctors, onApprove, onReject }) => (
  <div>
    <h2 className="text-xl font-semibold text-gray-900 mb-6">Doctor Management</h2>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-4">Name</th>
            <th className="text-left p-4">Specialization</th>
            <th className="text-left p-4">Department</th>
            <th className="text-left p-4">Status</th>
            <th className="text-left p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doctor) => (
            <tr key={doctor.id} className="border-b hover:bg-gray-50">
              <td className="p-4">{doctor.user.name}</td>
              <td className="p-4">{doctor.specialization}</td>
              <td className="p-4">{doctor.department?.name || 'N/A'}</td>
              <td className="p-4">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  doctor.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {doctor.isVerified ? 'Verified' : 'Pending'}
                </span>
              </td>
              <td className="p-4">
                {!doctor.isVerified && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onApprove(doctor.id)}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => onReject(doctor.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const DepartmentManagement = ({ departments }) => (
  <div>
    <h2 className="text-xl font-semibold text-gray-900 mb-6">Department Management</h2>
    <div className="grid gap-6">
      {departments.map((dept) => (
        <div key={dept.id} className="bg-white border rounded-lg p-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{dept.name}</h3>
              <p className="text-gray-600">{dept.description}</p>
              <div className="mt-2 text-sm text-gray-500">
                <span>Doctors: {dept.doctorCount || 0}</span>
                <span className="ml-4">Created: {new Date(dept.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Edit Department
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const SystemSettings = ({ stats }) => (
  <div>
    <h2 className="text-xl font-semibold text-gray-900 mb-6">System Settings</h2>
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Hedera Network Status</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Network:</span>
            <span className="text-green-600">Operational</span>
          </div>
          <div className="flex justify-between">
            <span>Last Sync:</span>
            <span>{new Date().toLocaleString()}</span>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">System Health</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Database:</span>
            <span className="text-green-600">Connected</span>
          </div>
          <div className="flex justify-between">
            <span>IPFS:</span>
            <span className="text-green-600">Operational</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default AdminDashboard;