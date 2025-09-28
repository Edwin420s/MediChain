import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  User, 
  FileText, 
  Share2, 
  Shield, 
  QrCode,
  Settings,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DashboardSidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const patientMenu = [
    { path: '/patient', icon: User, label: 'Dashboard' },
    { path: '/patient/records', icon: FileText, label: 'My Records' },
    { path: '/patient/share', icon: Share2, label: 'Share Access' },
    { path: '/patient/emergency', icon: QrCode, label: 'Emergency QR' },
    { path: '/patient/audit', icon: Shield, label: 'Audit Log' },
    { path: '/patient/settings', icon: Settings, label: 'Settings' },
  ];

  const doctorMenu = [
    { path: '/doctor', icon: User, label: 'Dashboard' },
    { path: '/doctor/patients', icon: FileText, label: 'Patients' },
    { path: '/doctor/requests', icon: Share2, label: 'Access Requests' },
    { path: '/doctor/audit', icon: Shield, label: 'Audit Log' },
    { path: '/doctor/settings', icon: Settings, label: 'Settings' },
  ];

  const adminMenu = [
    { path: '/admin', icon: User, label: 'Overview' },
    { path: '/admin/doctors', icon: FileText, label: 'Doctor Management' },
    { path: '/admin/departments', icon: Share2, label: 'Departments' },
    { path: '/admin/system', icon: Shield, label: 'System Settings' },
  ];

  const getMenu = () => {
    switch (user?.role) {
      case 'PATIENT': return patientMenu;
      case 'DOCTOR': return doctorMenu;
      case 'ADMIN': return adminMenu;
      default: return [];
    }
  };

  const getBasePath = () => {
    switch (user?.role) {
      case 'PATIENT': return '/patient';
      case 'DOCTOR': return '/doctor';
      case 'ADMIN': return '/admin';
      default: return '/';
    }
  };

  const menu = getMenu();
  const basePath = getBasePath();

  return (
    <div className="bg-white shadow-lg h-full w-64 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full flex items-center justify-center">
            <User className="text-white" size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 truncate">{user?.name}</h3>
            <p className="text-sm text-gray-500 capitalize">{user?.role?.toLowerCase()}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menu.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
                            (item.path !== basePath && location.pathname.startsWith(item.path));
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t">
        <button
          onClick={logout}
          className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 w-full transition-colors"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default DashboardSidebar;