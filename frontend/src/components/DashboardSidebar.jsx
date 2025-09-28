import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FileText, 
  Share2, 
  Shield, 
  QrCode, 
  User,
  Settings,
  LogOut
} from 'lucide-react';

const DashboardSidebar = ({ userRole }) => {
  const location = useLocation();

  const patientMenu = [
    { path: '/patient', icon: FileText, label: 'My Records' },
    { path: '/patient/share', icon: Share2, label: 'Share Access' },
    { path: '/patient/emergency', icon: QrCode, label: 'Emergency QR' },
    { path: '/patient/audit', icon: Shield, label: 'Audit Log' },
    { path: '/patient/profile', icon: User, label: 'Profile' },
  ];

  const doctorMenu = [
    { path: '/doctor', icon: FileText, label: 'Dashboard' },
    { path: '/doctor/patients', icon: User, label: 'Patients' },
    { path: '/doctor/requests', icon: Share2, label: 'Access Requests' },
    { path: '/doctor/audit', icon: Shield, label: 'Audit Log' },
  ];

  const adminMenu = [
    { path: '/admin', icon: FileText, label: 'Overview' },
    { path: '/admin/departments', icon: User, label: 'Departments' },
    { path: '/admin/doctors', icon: User, label: 'Doctors' },
    { path: '/admin/patients', icon: User, label: 'Patients' },
    { path: '/admin/system', icon: Settings, label: 'System Settings' },
  ];

  const menu = userRole === 'PATIENT' ? patientMenu : 
                userRole === 'DOCTOR' ? doctorMenu : adminMenu;

  return (
    <div className="w-64 bg-white shadow-lg min-h-screen">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold text-gray-800">MediChain</h2>
        <p className="text-sm text-gray-600">{userRole} Dashboard</p>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {menu.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition ${
                    location.pathname === item.path
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="absolute bottom-0 w-64 p-4 border-t">
        <button className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-50 w-full">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default DashboardSidebar;