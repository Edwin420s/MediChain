import React from 'react';

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-teal-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Your Health Records,<br />
              <span className="text-teal-300">Secured on Hedera</span>
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Decentralized, portable, and patient-owned medical data. 
              Never lose your medical history again.
            </p>
            <div className="space-x-4">
              <button className="bg-teal-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-400 transition">
                Get Started
              </button>
              <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition">
                Watch Demo
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/20 p-4 rounded-lg">
                  <div className="text-2xl mb-2">🩺</div>
                  <h3 className="font-semibold">Patient Records</h3>
                  <p className="text-sm text-blue-100">Secure & Immutable</p>
                </div>
                <div className="bg-white/20 p-4 rounded-lg">
                  <div className="text-2xl mb-2">🔒</div>
                  <h3 className="font-semibold">HIPAA Compliant</h3>
                  <p className="text-sm text-blue-100">Enterprise Security</p>
                </div>
                <div className="bg-white/20 p-4 rounded-lg">
                  <div className="text-2xl mb-2">⚡</div>
                  <h3 className="font-semibold">Instant Access</h3>
                  <p className="text-sm text-blue-100">QR Emergency Codes</p>
                </div>
                <div className="bg-white/20 p-4 rounded-lg">
                  <div className="text-2xl mb-2">🌍</div>
                  <h3 className="font-semibold">Global Access</h3>
                  <p className="text-sm text-blue-100">Anywhere, Anytime</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;