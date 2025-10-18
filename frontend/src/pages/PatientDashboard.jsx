import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Skeleton from '../components/Skeleton';
import EmptyState from '../components/EmptyState';

import { 
  FileText, 
  Share2, 
  Shield, 
  QrCode, 
  User,
  Plus,
  Download,
  Eye
} from 'lucide-react';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('records');

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
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-gray-600">Patient Dashboard</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-blue-50 px-3 py-1 rounded-full">
                <span className="text-blue-600 text-sm font-medium">
                  {user?.did}
                </span>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full flex items-center justify-center">
                <User className="text-white" size={20} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'records', name: 'My Records', icon: FileText },
              { id: 'share', name: 'Share Access', icon: Share2 },
              { id: 'emergency', name: 'Emergency QR', icon: QrCode },
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
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'records' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Medical Records</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700">
                <Plus size={18} />
                <span>Upload Record</span>
              </button>
            </div>

            <div className="grid gap-6">
              {records.map((record) => (
                <div key={record.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {record.title}
                      </h3>
                      <p className="text-gray-600">{record.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-sm text-gray-500">
                          {new Date(record.createdAt).toLocaleDateString()}
                        </span>
                        <span className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {record.recordType}
                        </span>
                        <span className="text-sm text-gray-500">
                          {(record.fileSize / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600">
                        <Eye size={18} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-green-600">
                        <Download size={18} />
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
                  onAction={() => setActiveTab('records')}
                />
              )}
            </div>
          </div>
        )}

        {activeTab === 'emergency' && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <QrCode className="mx-auto text-blue-600" size={64} />
            <h2 className="text-2xl font-bold text-gray-900 mt-4">Emergency Access QR Code</h2>
            <p className="text-gray-600 mt-2">
              This QR code provides emergency personnel with access to critical medical information
            </p>
            
            <div className="mt-6 inline-block p-4 bg-white border-4 border-red-400">
              <img 
                src={generateEmergencyQR()} 
                alt="Emergency QR Code" 
                className="w-48 h-48"
              />
            </div>
            
            <div className="mt-6 text-sm text-gray-500">
              <p>This QR code provides access to:</p>
              <ul className="mt-2 space-y-1">
                <li>• Blood type and allergies</li>
                <li>• Critical conditions and medications</li>
                <li>• Emergency contact information</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;