import React from 'react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About MediChain</h1>
          <p className="text-xl text-gray-600">Revolutionizing healthcare with blockchain technology</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-600 mb-6">
            MediChain is dedicated to creating a secure, decentralized platform for health records 
            that puts patients in control of their data. By leveraging Hedera Hashgraph technology, 
            we ensure immutability, security, and transparency in medical record management.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔐</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Secure Storage</h3>
              <p className="text-gray-600 text-sm">Medical records are encrypted and stored on IPFS</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⛓️</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Blockchain Anchored</h3>
              <p className="text-gray-600 text-sm">All access and changes are logged on Hedera</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Patient Controlled</h3>
              <p className="text-gray-600 text-sm">Patients decide who can access their records</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;