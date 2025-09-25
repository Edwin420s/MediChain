import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  User, 
  FileText, 
  Share2, 
  Shield, 
  QrCode,
  Users,
  Settings
} from 'lucide-react';

const DashboardSidebar = ({ userRole }) => {
  const location = useLocation();

  const patientMenu = [
    { name: 'Dashboard', href: '/patient', icon: User },
    { name: 'My Records', href: '/patient/records', icon: FileText },
    { name: 'Share Access', href: '/patient/share', icon: Share2 },
    { name: 'Emergency QR', href: '/patient/emergency', icon: QrCode },
    { name: 'Audit Log', href: '/patient/audit', icon: Shield },
  ];

  const doctorMenu = [
    { name: 'Dashboard', href: '/doctor', icon: User },
    { name: 'Patients', href: '/doctor/patients', icon: Users },
    { name: 'Records', href: '/doctor/records', icon: FileText },
    { name: 'Requests', href: '/doctor/requests', icon: Share2 },
    { name: 'Audit Log', href: '/doctor/audit', icon: Shield },
  ];

  const adminMenu = [
    { name: 'Dashboard', href: '/admin', icon: User },
    { name: 'Departments', href: '/admin/departments', icon: Users },
    { name: 'Doctors', href: '/admin/doctors', icon: Users },
    { name: 'Patients', href: '/admin/patients', icon: Users },
    { name: 'System Settings', href: '/admin/settings', icon: Settings },
  ];

  const menu = userRole === 'PATIENT' ? patientMenu : 
               userRole === 'DOCTOR' ? doctorMenu : adminMenu;

  return (
    <div className="bg-gray-800 w-64 min-h-screen p-4">
      <div className="flex items-center space-x-2 p-4">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">M</span>
        </div>
        <span className="text-white font-bold text-xl">MediChain</span>
      </div>
      <nav className="mt-8">
        <ul className="space-y-2">
          {menu.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium ${
                    isActive
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default DashboardSidebar;