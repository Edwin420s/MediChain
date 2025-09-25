import React from 'react';
import HeroSection from '../components/HeroSection';
import FeatureCard from '../components/FeatureCard';
import { Shield, FileText, Users, Zap } from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: Shield,
      title: 'Secure & Immutable',
      description: 'Medical records stored on Hedera blockchain with military-grade encryption'
    },
    {
      icon: FileText,
      title: 'Patient-Owned',
      description: 'You control your health data with granular permission settings'
    },
    {
      icon: Users,
      title: 'Seamless Sharing',
      description: 'Share records with doctors instantly while maintaining privacy'
    },
    {
      icon: Zap,
      title: 'Instant Access',
      description: 'Emergency QR codes for life-saving information when needed most'
    }
  ];

  return (
    <div className="min-h-screen">
      <HeroSection />
      
      {/* Problem Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              The Problem We Solve
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 bg-red-50 rounded-lg">
                <div className="text-red-600 text-2xl mb-4">💸</div>
                <h3 className="font-semibold text-gray-900 mb-2">Costly Repeated Tests</h3>
                <p className="text-gray-600">Patients waste money on duplicate medical tests</p>
              </div>
              <div className="p-6 bg-red-50 rounded-lg">
                <div className="text-red-600 text-2xl mb-4">📂</div>
                <h3 className="font-semibold text-gray-900 mb-2">Lost Records</h3>
                <p className="text-gray-600">Critical medical history lost between hospitals</p>
              </div>
              <div className="p-6 bg-red-50 rounded-lg">
                <div className="text-red-600 text-2xl mb-4">❌</div>
                <h3 className="font-semibold text-gray-900 mb-2">Misdiagnosis</h3>
                <p className="text-gray-600">Incomplete history leads to wrong treatments</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How MediChain Works
            </h2>
            <p className="text-xl text-gray-600">Secure, decentralized health records powered by Hedera</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-teal-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Take Control of Your Health Data?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of patients and doctors using MediChain
          </p>
          <div className="space-x-4">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
              Sign Up as Patient
            </button>
            <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition">
              I'm a Doctor
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;