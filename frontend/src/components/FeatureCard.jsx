import React from 'react'

const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-custom hover:shadow-xl transition-shadow duration-300">
      <div className="text-3xl text-primary mb-4">
        <Icon size={48} />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

export default FeatureCard