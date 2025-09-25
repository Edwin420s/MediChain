import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FileText, User, Shield, Settings, LogOut } from 'lucide-react'

const DashboardSidebar = ({ userRole }) => {
  const location = useLocation()

  const patientMenu = [
    { icon: FileText, label: 'My Records', path: '/patient/records' },
    { icon: User, label: 'Profile', path: '/patient/profile' },
    { icon: Shield, label: 'Access Control', path: '/patient/access' },
    { icon: Settings, label: 'Settings', path: '/patient/settings' },
  ]

  const doctorMenu = [
    { icon: FileText, label: 'Patients', path: '/doctor/patients' },
    { icon: User, label: 'Profile', path: '/doctor/profile' },
    { icon: Shield, label: 'Requests', path: '/doctor/requests' },
    { icon: Settings, label: 'Settings', path: '/doctor/settings' },
  ]

  const adminMenu = [
    { icon: User, label: 'Doctors', path: '/admin/doctors' },
    { icon: Shield, label: 'Departments', path: '/admin/departments' },
    { icon: Settings, label: 'System Settings', path: '/admin/settings' },
  ]

  const menu = userRole === 'patient' ? patientMenu : 
               userRole === 'doctor' ? doctorMenu : adminMenu

  return (
    <div className="bg-white h-full shadow-lg w-64">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">MediChain</h2>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {menu.map((item, index) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <li key={index}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      <div className="absolute bottom-0 w-64 p-4 border-t">
        <button className="flex items-center space-x-3 text-gray-700 hover:text-red-600 transition-colors">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}

export default DashboardSidebar