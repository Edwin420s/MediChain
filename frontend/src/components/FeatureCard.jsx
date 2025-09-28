import React from 'react';

const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <div className="bg-white rounded-xl shadow-soft p-6 hover:shadow-medium transition-all duration-300 hover:transform hover:-translate-y-1">
      <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-100 to-teal-100 rounded-lg mb-4">
        <Icon className="text-medi-blue" size={24} />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
};

export default FeatureCard;