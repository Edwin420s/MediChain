import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Skeleton from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import { motion } from 'framer-motion';
import {
  Activity,
  FileText,
  Shield,
  QrCode,
  Settings,
  LogOut,
  Upload,
  Calendar,
  Download,
  Eye,
  CheckCircle,
  Clock,
  Share2,
  X,
  User
} from 'lucide-react';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await api.get('/patients/records');
      setRecords(response.data);
    } catch (error) {
      console.error('Error fetching records:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateEmergencyQR = () => {
    // In a real implementation, this would generate a QR code with emergency access token
    const emergencyData = {
      patientDid: user.did,
      timestamp: Date.now(),
      type: 'emergency_access'
    };
    
    const qrData = btoa(JSON.stringify(emergencyData));
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrData}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Skeleton rows={6} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Activity className="h-7 w-7 text-blue-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">MediChain</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-semibold">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.did}</p>
              </div>
              <div className="w-9 h-9 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full flex items-center justify-center">
                <User className="text-white" size={16} />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-64 space-y-2">
            {[
              { id: 'overview', name: 'Overview', icon: Activity },
              { id: 'records', name: 'My Records', icon: FileText },
              { id: 'access', name: 'Access Control', icon: Shield },
              { id: 'emergency', name: 'Emergency QR', icon: QrCode },
              { id: 'settings', name: 'Settings', icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </aside>

          <main className="flex-1">
            {activeTab === 'overview' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
                  <p className="text-gray-600">Here's your health overview</p>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <div className="flex items-center justify-between mb-2">
                      <FileText className="h-7 w-7 text-blue-600" />
                      <span className="text-3xl font-bold">{records.length}</span>
                    </div>
                    <p className="text-gray-600">Total Records</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <div className="flex items-center justify-between mb-2">
                      <Clock className="h-7 w-7 text-yellow-600" />
                      <span className="text-3xl font-bold">0</span>
                    </div>
                    <p className="text-gray-600">Pending Requests</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <div className="flex items-center justify-between mb-2">
                      <CheckCircle className="h-7 w-7 text-green-600" />
                      <span className="text-3xl font-bold">0</span>
                    </div>
                    <p className="text-gray-600">Active Access</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
                  <div className="space-y-4">
                    {records.slice(0, 3).map((record) => (
                      <div key={record.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <FileText className="h-6 w-6 text-blue-600" />
                          <div>
                            <p className="font-semibold">{record.title}</p>
                            <p className="text-sm text-gray-600">{record.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">{new Date(record.createdAt).toLocaleDateString()}</p>
                          <p className="text-xs text-gray-500">{record.recordType}</p>
                        </div>
                      </div>
                    ))}
                    {records.length === 0 && (
                      <div className="text-sm text-gray-500">No recent activity yet.</div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'records' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex justify-between items-center">
                  <h1 className="text-3xl font-bold">My Medical Records</h1>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Upload className="h-5 w-5" />
                    <span>Upload Record</span>
                  </button>
                </div>
                <div className="space-y-4">
                  {records.map((record) => (
                    <div key={record.id} className="bg-white p-6 rounded-xl shadow-md">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="p-3 bg-blue-100 rounded-lg">
                            <FileText className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold">{record.title}</h3>
                            <p className="text-gray-600">{record.description}</p>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(record.createdAt).toLocaleDateString()}</span>
                              </div>
                              <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700">{record.recordType}</span>
                              {record.fileSize ? (
                                <span>{(record.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                              ) : null}
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Eye className="h-5 w-5" />
                          </button>
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Download className="h-5 w-5" />
                          </button>
                          <button onClick={() => { setSelectedRecord(record); setShowShareModal(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Share2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {records.length === 0 && (
                    <EmptyState
                      icon={FileText}
                      title="No records yet"
                      description="Upload your first medical record to get started"
                      action="Upload Record"
                      onAction={() => {}}
                    />
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'access' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <h1 className="text-3xl font-bold">Access Control</h1>
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h2 className="text-xl font-bold mb-4">Active Access</h2>
                  <div className="text-sm text-gray-500">No active access yet.</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h2 className="text-xl font-bold mb-4">Pending Requests</h2>
                  <div className="text-sm text-gray-500">No pending requests.</div>
                </div>
              </motion.div>
            )}

            {activeTab === 'emergency' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <h1 className="text-3xl font-bold">Emergency QR Code</h1>
                <div className="bg-white p-8 rounded-xl shadow-md text-center">
                  <div className="inline-block p-6 bg-gradient-to-br from-blue-100 to-teal-100 rounded-2xl mb-6">
                    <QrCode className="h-48 w-48 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Your Emergency Access QR Code</h2>
                  <p className="text-gray-600 mb-6">This QR code provides instant access to critical health information in emergencies</p>
                  <div className="bg-blue-50 p-4 rounded-lg mb-6 text-left inline-block">
                    <h3 className="font-semibold mb-2">Included:</h3>
                    <ul className="text-sm text-gray-700 space-y-1 list-disc pl-5">
                      <li>Blood type and allergies</li>
                      <li>Critical conditions and medications</li>
                      <li>Emergency contact</li>
                    </ul>
                  </div>
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Download QR Code</button>
                </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <h1 className="text-3xl font-bold">Settings</h1>
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h2 className="text-xl font-bold mb-4">Profile</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                      <input type="text" value={user?.name || ''} readOnly className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input type="email" value={user?.email || ''} readOnly className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Hedera DID</label>
                      <input type="text" value={user?.did || ''} readOnly className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </main>
        </div>
      </div>

      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-xl p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Share Record</h3>
              <button onClick={() => setShowShareModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Doctor's Email or DID</label>
                <input type="text" placeholder="doctor@example.com" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Access Duration</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                  <option>1 day</option>
                  <option>7 days</option>
                  <option>30 days</option>
                  <option>Until revoked</option>
                </select>
              </div>
              <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Grant Access</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;