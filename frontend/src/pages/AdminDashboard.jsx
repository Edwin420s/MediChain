import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import DashboardSidebar from '../components/DashboardSidebar';
import { 
  Users,
  UserCheck,
  UserPlus,
  Settings
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({});
  const [pendingDoctors, setPendingDoctors] = useState([]);

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchStats();
    } else if (activeTab === 'doctors') {
      fetchPendingDoctors();
    }
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchPendingDoctors = async () => {
    try {
      const response = await api.get('/admin/doctors/pending');
      setPendingDoctors(response.data);
    } catch (error) {
      console.error('Error fetching pending doctors:', error);
    }
  };

  const handleApproveDoctor = async (doctorId) => {
    try {
      await api.post(`/admin/doctors/${doctorId}/approve`);
      setPendingDoctors(pendingDoctors.filter(doc => doc.id !== doctorId));
    } catch (error) {
      console.error('Error approving doctor:', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar userRole={user?.role} />
      <div className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">System Administration</p>
        </div>

        {activeTab === 'dashboard' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                    <Users size={24} />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-lg font-semibold">Total Patients</h2>
                    <p className="text-2xl font-bold">{stats.totalPatients || 0}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 text-green-600">
                    <UserCheck size={24} />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-lg font-semibold">Verified Doctors</h2>
                    <p className="text-2xl font-bold">{stats.verifiedDoctors || 0}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                    <UserPlus size={24} />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-lg font-semibold">Pending Doctors</h2>
                    <p className="text-2xl font-bold">{stats.pendingDoctors || 0}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                    <Settings size={24} />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-lg font-semibold">Departments</h2>
                    <p className="text-2xl font-bold">{stats.departments || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">System Overview</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span>Hedera Network</span>
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Operational</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span>IPFS Storage</span>
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Operational</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span>Database</span>
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Connected</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'doctors' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Pending Doctor Approvals</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {pendingDoctors.map(doctor => (
                  <div key={doctor.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">{doctor.user.name}</h3>
                      <p className="text-sm text-gray-600">License: {doctor.licenseNumber}</p>
                      <p className="text-sm text-gray-600">Specialization: {doctor.specialization}</p>
                    </div>
                    <button 
                      onClick={() => handleApproveDoctor(doctor.id)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700"
                    >
                      Approve
                    </button>
                  </div>
                ))}
                {pendingDoctors.length === 0 && (
                  <p className="text-center text-gray-600 py-4">No pending approvals</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;