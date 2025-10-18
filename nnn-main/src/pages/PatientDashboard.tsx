import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
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
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function PatientDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const mockRecords = [
    {
      id: '1',
      type: 'Lab Result',
      date: '2025-10-15',
      doctor: 'Dr. Sarah Johnson',
      status: 'verified',
      description: 'Blood Test Results',
    },
    {
      id: '2',
      type: 'Prescription',
      date: '2025-10-10',
      doctor: 'Dr. Michael Chen',
      status: 'verified',
      description: 'Medication for Hypertension',
    },
    {
      id: '3',
      type: 'Imaging',
      date: '2025-10-05',
      doctor: 'Dr. Emily Brown',
      status: 'verified',
      description: 'Chest X-Ray',
    },
  ];

  const mockAccessRequests = [
    {
      id: '1',
      doctor: 'Dr. James Wilson',
      specialty: 'Cardiology',
      reason: 'Routine Checkup',
      date: '2025-10-18',
    },
    {
      id: '2',
      doctor: 'Dr. Lisa Anderson',
      specialty: 'Dermatology',
      reason: 'Skin Condition Consultation',
      date: '2025-10-17',
    },
  ];

  const handleShareRecord = (record: any) => {
    setSelectedRecord(record);
    setShowShareModal(true);
  };

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
                <p className="text-xs text-gray-500">{user?.did}</p>
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
            <button
              onClick={() => setActiveTab('records')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'records'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FileText className="h-5 w-5" />
              <span>My Records</span>
            </button>
            <button
              onClick={() => setActiveTab('access')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'access'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Shield className="h-5 w-5" />
              <span>Access Control</span>
            </button>
            <button
              onClick={() => setActiveTab('emergency')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'emergency'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <QrCode className="h-5 w-5" />
              <span>Emergency QR</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'settings'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
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
                  <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
                  <p className="text-gray-600">Here's your health overview</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <div className="flex items-center justify-between mb-2">
                      <FileText className="h-8 w-8 text-blue-600" />
                      <span className="text-3xl font-bold">{mockRecords.length}</span>
                    </div>
                    <p className="text-gray-600">Total Records</p>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <div className="flex items-center justify-between mb-2">
                      <Clock className="h-8 w-8 text-yellow-600" />
                      <span className="text-3xl font-bold">{mockAccessRequests.length}</span>
                    </div>
                    <p className="text-gray-600">Pending Requests</p>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <div className="flex items-center justify-between mb-2">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                      <span className="text-3xl font-bold">5</span>
                    </div>
                    <p className="text-gray-600">Active Access</p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
                  <div className="space-y-4">
                    {mockRecords.slice(0, 2).map((record) => (
                      <div
                        key={record.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <FileText className="h-6 w-6 text-blue-600" />
                          <div>
                            <p className="font-semibold">{record.type}</p>
                            <p className="text-sm text-gray-600">{record.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">{record.date}</p>
                          <p className="text-xs text-gray-500">{record.doctor}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'records' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h1 className="text-3xl font-bold">My Medical Records</h1>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Upload className="h-5 w-5" />
                    <span>Upload Record</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {mockRecords.map((record) => (
                    <div key={record.id} className="bg-white p-6 rounded-xl shadow-md">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="p-3 bg-blue-100 rounded-lg">
                            <FileText className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold">{record.type}</h3>
                            <p className="text-gray-600">{record.description}</p>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>{record.date}</span>
                              </div>
                              <span>{record.doctor}</span>
                              <div className="flex items-center space-x-1">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span className="text-green-600">Verified on Hedera</span>
                              </div>
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
                          <button
                            onClick={() => handleShareRecord(record)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Share2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'access' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h1 className="text-3xl font-bold">Access Control</h1>

                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h2 className="text-xl font-bold mb-4">Pending Access Requests</h2>
                  <div className="space-y-4">
                    {mockAccessRequests.map((request) => (
                      <div
                        key={request.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-semibold">{request.doctor}</p>
                          <p className="text-sm text-gray-600">{request.specialty}</p>
                          <p className="text-xs text-gray-500 mt-1">Reason: {request.reason}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                            Approve
                          </button>
                          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                            Deny
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h2 className="text-xl font-bold mb-4">Active Access</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold">Dr. Sarah Johnson</p>
                        <p className="text-sm text-gray-600">General Practice</p>
                        <p className="text-xs text-gray-500 mt-1">Access granted: 2025-09-15</p>
                      </div>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                        Revoke
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'emergency' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h1 className="text-3xl font-bold">Emergency QR Code</h1>

                <div className="bg-white p-8 rounded-xl shadow-md text-center">
                  <div className="inline-block p-8 bg-gradient-to-br from-blue-100 to-teal-100 rounded-2xl mb-6">
                    <QrCode className="h-48 w-48 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Your Emergency Access QR Code</h2>
                  <p className="text-gray-600 mb-6">
                    This QR code provides instant access to critical health information in emergencies
                  </p>
                  <div className="bg-blue-50 p-4 rounded-lg mb-6">
                    <h3 className="font-semibold mb-2">Critical Information Included:</h3>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>Blood Type: O+</li>
                      <li>Allergies: Penicillin</li>
                      <li>Emergency Contact: +254 712 345 678</li>
                      <li>Chronic Conditions: None</li>
                    </ul>
                  </div>
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Download QR Code
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h1 className="text-3xl font-bold">Settings</h1>

                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h2 className="text-xl font-bold mb-4">Profile Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                      <input
                        type="text"
                        value={user?.name}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={user?.email}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hedera DID
                      </label>
                      <input
                        type="text"
                        value={user?.did}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h2 className="text-xl font-bold mb-4">Privacy & Security</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-600">Add an extra layer of security</p>
                      </div>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Enable
                      </button>
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
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-8 max-w-md w-full"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Share Record</h3>
              <button onClick={() => setShowShareModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Doctor's Email or DID
                </label>
                <input
                  type="text"
                  placeholder="doctor@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Access Duration
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                  <option>1 day</option>
                  <option>7 days</option>
                  <option>30 days</option>
                  <option>Until revoked</option>
                </select>
              </div>
              <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Grant Access
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
