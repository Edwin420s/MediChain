import React from 'react';
import { Link, useRouteError } from 'react-router-dom';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

const ErrorPage = () => {
  const error = useRouteError();
  console.error(error);

  const getErrorMessage = () => {
    if (error.status === 404) {
      return "The page you're looking for doesn't exist.";
    }
    
    if (error.status === 403) {
      return "You don't have permission to access this page.";
    }
    
    if (error.status === 500) {
      return "Something went wrong on our end. Please try again later.";
    }
    
    return "An unexpected error occurred. Please try again.";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-100">
            <AlertTriangle className="h-12 w-12 text-red-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            {error.status || 'Error'}
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            {getErrorMessage()}
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <Link
            to="/"
            className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Home className="mr-2 h-5 w-5" />
            Go back home
          </Link>
          
          <button
            onClick={() => window.location.reload()}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <RefreshCw className="mr-2 h-5 w-5" />
            Try again
          </button>
        </div>

        {process.env.NODE_ENV === 'development' && error.stack && (
          <div className="mt-8 p-4 bg-gray-100 rounded-lg text-left">
            <details className="text-sm">
              <summary className="cursor-pointer font-medium text-gray-700">
                Error details (development only)
              </summary>
              <pre className="mt-2 text-xs text-gray-600 overflow-auto">
                {error.stack}
              </pre>
            </details>
          </div>
        )}

        <div className="mt-8 text-sm text-gray-500">
          <p>
            If the problem persists, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;