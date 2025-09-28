import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Download, Eye, Calendar, User } from 'lucide-react';

const RecordsViewer = () => {
  const { recordId } = useParams();
  const { user } = useAuth();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRecord();
  }, [recordId]);

  const fetchRecord = async () => {
    try {
      const response = await api.get(`/records/${recordId}`);
      setRecord(response.data);
    } catch (error) {
      setError('Failed to load record');
      console.error('Error fetching record:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await api.get(`/records/${recordId}/download`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${record.title}.${record.fileType}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading record:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{record.title}</h1>
              <p className="text-gray-600">{record.description}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleDownload}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Download size={18} />
                <span>Download</span>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Record Details</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Calendar size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Created: {new Date(record.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <User size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Doctor: {record.doctorName}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  Type: <span className="capitalize">{record.recordType}</span>
                </div>
                <div className="text-sm text-gray-600">
                  File Size: {(record.fileSize / 1024 / 1024).toFixed(2)} MB
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Access Information</h3>
              <div className="space-y-2">
                <div className="text-sm text-gray-600">
                  Status: <span className="text-green-600">Available</span>
                </div>
                <div className="text-sm text-gray-600">
                  IPFS CID: <code className="bg-gray-200 px-1 rounded">{record.cid}</code>
                </div>
                <div className="text-sm text-gray-600">
                  Hedera Tx: <code className="bg-gray-200 px-1 rounded">{record.hcsTxId}</code>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold text-gray-900 mb-4">Record Preview</h3>
            <div className="bg-gray-100 rounded-lg p-8 text-center">
              <Eye size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Preview would be displayed here based on file type</p>
              <p className="text-sm text-gray-500 mt-2">
                Supported types: PDF, Images, Text documents
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordsViewer;