import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  Search,
  FileText,
  Upload,
  LogOut,
  Users,
  Clock,
  CheckCircle,
  Calendar,
  Eye,
  Download,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function DoctorDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const mockPatients = [
    {
      id: '1',
      name: 'John Mwangi',
      did: 'did:hedera:0.0.12345',
      lastVisit: '2025-10-15',
      status: 'approved',
    },
    {
      id: '2',
      name: 'Mary Wanjiku',
      did: 'did:hedera:0.0.54321',
      lastVisit: '2025-10-12',
      status: 'approved',
    },
  ];

  const mockPendingRequests = [
    {
      id: '1',
      patient: 'James Ochieng',
      did: 'did:hedera:0.0.98765',
      requestDate: '2025-10-18',
      reason: 'Routine checkup',
    },
  ];

  const mockRecords = [
    {
      id: '1',
      patient: 'John Mwangi',
      type: 'Lab Result',
      date: '2025-10-15',
      description: 'Blood Test Results',
    },
    {
      id: '2',
      patient: 'Mary Wanjiku',
      type: 'Prescription',
      date: '2025-10-12',
      description: 'Medication for Hypertension',
    },
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
                <p className="text-xs text-gray-500">Doctor</p>
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
              onClick={() => setActiveTab('patients')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'patients'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Users className="h-5 w-5" />
              <span>My Patients</span>
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'requests'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Clock className="h-5 w-5" />
              <span>Access Requests</span>
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'upload'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Upload className="h-5 w-5" />
              <span>Upload Record</span>
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
                  <h1 className="text-3xl font-bold mb-2">Welcome, Dr. {user?.name}!</h1>
                  <p className="text-gray-600">Here's your practice overview</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <div className="flex items-center justify-between mb-2">
                      <Users className="h-8 w-8 text-blue-600" />
                      <span className="text-3xl font-bold">{mockPatients.length}</span>
                    </div>
                    <p className="text-gray-600">Total Patients</p>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <div className="flex items-center justify-between mb-2">
                      <Clock className="h-8 w-8 text-yellow-600" />
                      <span className="text-3xl font-bold">{mockPendingRequests.length}</span>
                    </div>
                    <p className="text-gray-600">Pending Requests</p>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <div className="flex items-center justify-between mb-2">
                      <FileText className="h-8 w-8 text-green-600" />
                      <span className="text-3xl font-bold">{mockRecords.length}</span>
                    </div>
                    <p className="text-gray-600">Records Uploaded</p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
                  <div className="space-y-4">
                    {mockRecords.map((record) => (
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
                          <p className="text-sm font-medium">{record.patient}</p>
                          <p className="text-xs text-gray-500">{record.date}</p>
                        </div>
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
                <div>
                  <h1 className="text-3xl font-bold mb-4">My Patients</h1>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by name or DID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {mockPatients.map((patient) => (
                    <div key={patient.id} className="bg-white p-6 rounded-xl shadow-md">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-bold">{patient.name}</h3>
                          <p className="text-sm text-gray-600">{patient.did}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>Last visit: {patient.lastVisit}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-green-600">Access granted</span>
                            </div>
                          </div>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          View Records
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'requests' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h1 className="text-3xl font-bold">Access Requests</h1>

                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h2 className="text-xl font-bold mb-4">Pending Requests</h2>
                  <div className="space-y-4">
                    {mockPendingRequests.map((request) => (
                      <div
                        key={request.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-semibold">{request.patient}</p>
                          <p className="text-sm text-gray-600">{request.did}</p>
                          <p className="text-xs text-gray-500 mt-1">Reason: {request.reason}</p>
                        </div>
                        <div className="text-right text-sm text-gray-600">
                          <p>Requested: {request.requestDate}</p>
                          <p className="text-yellow-600 mt-1">Awaiting patient approval</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 p-6 rounded-xl">
                  <h3 className="font-semibold mb-2">Request New Patient Access</h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter patient DID or email..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Request
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'upload' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h1 className="text-3xl font-bold">Upload Medical Record</h1>

                <div className="bg-white p-8 rounded-xl shadow-md">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Patient
                      </label>
                      <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent">
                        <option>Select patient...</option>
                        {mockPatients.map((patient) => (
                          <option key={patient.id} value={patient.id}>
                            {patient.name} ({patient.did})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Record Type
                      </label>
                      <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent">
                        <option>Lab Result</option>
                        <option>Prescription</option>
                        <option>Imaging</option>
                        <option>Diagnosis</option>
                        <option>Treatment Plan</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        placeholder="Enter description..."
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload File
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-600 transition-colors cursor-pointer">
                        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                        <p className="text-sm text-gray-500">PDF, PNG, JPG up to 10MB</p>
                      </div>
                    </div>

                    <button className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                      Upload to Hedera
                    </button>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-700">
                        <strong>Note:</strong> Files are encrypted before upload to IPFS. Metadata is
                        stored on Hedera for immutability and verification.
                      </p>
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
