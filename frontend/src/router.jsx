import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layouts
import App from './App';

// Pages
import LandingPage from './pages/LandingPage';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';

// Auth pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Error page
import ErrorPage from './pages/ErrorPage';

// Protected route component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Public route component (redirect if already authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    // Redirect to appropriate dashboard based on role
    switch (user.role) {
      case 'PATIENT':
        return <Navigate to="/patient" replace />;
      case 'DOCTOR':
        return <Navigate to="/doctor" replace />;
      case 'ADMIN':
        return <Navigate to="/admin" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return children;
};

// Create router configuration
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <LandingPage />
      },
      {
        path: 'login',
        element: (
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        )
      },
      {
        path: 'register',
        element: (
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        )
      },
      {
        path: 'patient',
        element: (
          <ProtectedRoute allowedRoles={['PATIENT']}>
            <PatientDashboard />
          </ProtectedRoute>
        )
      },
      {
        path: 'patient/records',
        element: (
          <ProtectedRoute allowedRoles={['PATIENT']}>
            <PatientDashboard />
          </ProtectedRoute>
        )
      },
      {
        path: 'patient/share',
        element: (
          <ProtectedRoute allowedRoles={['PATIENT']}>
            <PatientDashboard />
          </ProtectedRoute>
        )
      },
      {
        path: 'patient/emergency',
        element: (
          <ProtectedRoute allowedRoles={['PATIENT']}>
            <PatientDashboard />
          </ProtectedRoute>
        )
      },
      {
        path: 'patient/audit',
        element: (
          <ProtectedRoute allowedRoles={['PATIENT']}>
            <PatientDashboard />
          </ProtectedRoute>
        )
      },
      {
        path: 'doctor',
        element: (
          <ProtectedRoute allowedRoles={['DOCTOR']}>
            <DoctorDashboard />
          </ProtectedRoute>
        )
      },
      {
        path: 'doctor/patients',
        element: (
          <ProtectedRoute allowedRoles={['DOCTOR']}>
            <DoctorDashboard />
          </ProtectedRoute>
        )
      },
      {
        path: 'doctor/requests',
        element: (
          <ProtectedRoute allowedRoles={['DOCTOR']}>
            <DoctorDashboard />
          </ProtectedRoute>
        )
      },
      {
        path: 'doctor/audit',
        element: (
          <ProtectedRoute allowedRoles={['DOCTOR']}>
            <DoctorDashboard />
          </ProtectedRoute>
        )
      },
      {
        path: 'admin',
        element: (
          <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        )
      },
      {
        path: 'admin/doctors',
        element: (
          <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        )
      },
      {
        path: 'admin/departments',
        element: (
          <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        )
      },
      {
        path: 'admin/system',
        element: (
          <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        )
      },
      // Catch all route - 404
      {
        path: '*',
        element: <ErrorPage />
      }
    ]
  }
]);

// Router provider component
const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;