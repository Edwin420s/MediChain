import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { doctorAPI } from '../services/api';
import { 
  Users, 
  FileText, 
  Shield, 
  UserCheck,
  Search,
  Plus,
  Download,
  Eye
} from 'lucide-react';
import { motion } from 'framer-motion';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [accessRequests, setAccessRequests] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('patients');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [patientsResponse, requestsResponse, statsResponse] = await Promise.all([
        doctorAPI.getPatients(),
        doctorAPI.getAccessRequests(),
        doctorAPI.getDashboardStats()
      ]);

      setPatients(patientsResponse.data || []);
      setAccessRequests(requestsResponse.data || []);
      setStats(statsResponse.data || {});
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAccess = async (patientDid, purpose) => {
    try {
      await doctorAPI.requestAccess({
        patientDid,
        purpose,
        durationDays: 30
      });
      alert('Access request sent successfully');
      loadDashboardData();
    } catch (error) {
      console.error('Error requesting access:', error);
      alert('Failed to send access request');
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.did.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <h1 className="text-2xl font-bold text-gray-900">Welcome, Dr. {user?.name}!</h1>
              <p className="text-gray-600">Medical Professional Dashboard</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-green-50 px-3 py-1 rounded-full">
                <span className="text-green-600 text-sm font-medium">{user?.doctor?.specialization}</span>
              </div>
              <div className="text-sm text-gray-500">Verified: {user?.doctor?.isVerified ? '✅' : '⏳'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[{
            icon: Users,
            color: 'text-blue-600',
            label: 'Total Patients',
            value: stats.totalPatients || 0
          },{
            icon: FileText,
            color: 'text-green-600',
            label: 'Records Accessed',
            value: stats.recordsAccessed || 0
          },{
            icon: UserCheck,
            color: 'text-purple-600',
            label: 'Pending Requests',
            value: stats.pendingRequests || 0
          }].map((card, i) => (
            <motion.div key={card.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <card.icon className={`${card.color} mr-3`} size={24} />
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'patients', name: 'My Patients', icon: Users },
                { id: 'requests', name: 'Access Requests', icon: UserCheck },
                { id: 'audit', name: 'Audit Log', icon: Shield }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
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
            {activeTab === 'patients' && (
              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Patient List</h2>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search patients..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredPatients.map((patient) => (
                    <motion.div key={patient.did} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-lg shadow p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                          <p className="text-sm text-gray-600">{patient.did}</p>
                          <div className="flex space-x-4 mt-2">
                            <span className="text-sm text-gray-500">
                              Records: {patient.recordCount || 0}
                            </span>
                            <span className="text-sm text-gray-500">
                              Last visit: {patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : 'Never'}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleRequestAccess(patient.did, 'Routine checkup')}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
                          >
                            Request Access
                          </button>
                          {patient.hasAccess && (
                            <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700">
                              View Records
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {filteredPatients.length === 0 && (
                    <div className="text-center py-12">
                      <Users className="mx-auto text-gray-400" size={48} />
                      <h3 className="mt-4 text-lg font-medium text-gray-900">No patients found</h3>
                      <p className="text-gray-600">Patients will appear here once they grant you access</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'requests' && (
              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Access Requests</h2>
                <div className="space-y-4">
                  {accessRequests.map((request) => (
                    <div key={request.id} className="bg-white rounded-lg shadow p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold text-gray-900">{request.patientName}</h3>
                          <p className="text-sm text-gray-600">{request.purpose}</p>
                          <p className="text-sm text-gray-500">
                            Requested: {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            request.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                            request.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {request.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {accessRequests.length === 0 && (
                    <div className="text-center py-12">
                      <UserCheck className="mx-auto text-gray-400" size={48} />
                      <h3 className="mt-4 text-lg font-medium text-gray-900">No access requests</h3>
                      <p className="text-gray-600">Your access requests will appear here</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;