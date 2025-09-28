import React from 'react';

const TestimonialCard = ({ name, role, content, avatar }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <p className="text-gray-600 mb-4">"{content}"</p>
      <div className="flex items-center">
        <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
        <div>
          <h4 className="font-semibold text-gray-900">{name}</h4>
          <p className="text-gray-500 text-sm">{role}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;