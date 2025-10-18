import React from 'react';

const EmptyState = ({ icon: Icon, title, description, action, onAction }) => {
  return (
    <div className="text-center py-12 bg-white rounded-lg border">
      {Icon ? <Icon className="mx-auto text-gray-400" size={48} /> : null}
      <h3 className="mt-4 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-gray-600">{description}</p>
      {action ? (
        <button
          onClick={onAction}
          className="mt-6 inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          {action}
        </button>
      ) : null}
    </div>
  );
};

export default EmptyState;
