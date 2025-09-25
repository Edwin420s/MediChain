import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import DashboardSidebar from '../components/DashboardSidebar';
import { 
  User, 
  FileText, 
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [patients, setPatients] = useState([]);
  const [accessRequests, setAccessRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activeTab === 'patients') {
      fetchPatients();
    } else if (activeTab === 'requests') {
      fetchAccessRequests();
    }
  }, [activeTab]);

  const fetchPatients = async () => {
    try {
      const response = await api.get('/doctor/patients');
      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const fetchAccessRequests = async () => {
    try {
      const response = await api.get('/doctor/requests');
      setAccessRequests(response.data);
    } catch (error) {
      console.error('Error fetching access requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRequest = async (requestId) => {
    try {
      await api.post(`/doctor/requests/${requestId}/approve`);
      setAccessRequests(accessRequests.filter(req => req.id !== requestId));
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  const handleDenyRequest = async (requestId) => {
    try {
      await api.post(`/doctor/requests/${requestId}/deny`);
      setAccessRequests(accessRequests.filter(req => req.id !== requestId));
    } catch (error) {
      console.error('Error denying request:', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar userRole={user?.role} />
      <div className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Doctor Dashboard</h1>
          <p className="text-gray-600">Welcome, Dr. {user?.name}</p>
        </div>

        {activeTab === 'dashboard' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                    <User size={24} />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-lg font-semibold">Total Patients</h2>
                    <p className="text-2xl font-bold">24</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 text-green-600">
                    <FileText size={24} />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-lg font-semibold">Records Accessed</h2>
                    <p className="text-2xl font-bold">156</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                    <Clock size={24} />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-lg font-semibold">Pending Requests</h2>
                    <p className="text-2xl font-bold">3</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">Accessed patient records</p>
                    <p className="text-sm text-gray-600">John Doe • 2 hours ago</p>
                  </div>
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">View</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">New access request</p>
                    <p className="text-sm text-gray-600">Jane Smith • 4 hours ago</p>
                  </div>
                  <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">Pending</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'patients' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Patient List</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {patients.map(patient => (
                  <div key={patient.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">{patient.user.name}</h3>
                      <p className="text-sm text-gray-600">DID: {patient.user.did}</p>
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
                      View Records
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Access Requests</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {accessRequests.map(request => (
                  <div key={request.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{request.patient.user.name}</h3>
                        <p className="text-sm text-gray-600">Purpose: {request.purpose}</p>
                        <p className="text-sm text-gray-600">Requested: {new Date(request.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleApproveRequest(request.id)}
                          className="flex items-center space-x-1 bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700"
                        >
                          <CheckCircle size={16} />
                          <span>Approve</span>
                        </button>
                        <button 
                          onClick={() => handleDenyRequest(request.id)}
                          className="flex items-center space-x-1 bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700"
                        >
                          <XCircle size={16} />
                          <span>Deny</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {accessRequests.length === 0 && !loading && (
                  <p className="text-center text-gray-600 py-4">No pending requests</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;