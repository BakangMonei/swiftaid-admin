import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  FaHome,
  FaUsers,
  FaBell,
  FaMapMarkedAlt,
  FaChartLine,
  FaCog,
  FaUserShield,
  FaFire,
  FaFirstAid,
  FaRobot,
  FaFileAlt,
} from 'react-icons/fa';

function Sidebar() {
  const { logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: FaHome },
    { name: 'User Management', href: '/users', icon: FaUsers },
    { name: 'Alert Management', href: '/alerts', icon: FaBell },
    { name: 'GBV Reports', href: '/gbv-reports', icon: FaUserShield },
    { name: 'Health Monitoring', href: '/health-monitoring', icon: FaFirstAid },
    { name: 'Fire Drill Logs', href: '/fire-drills', icon: FaFire },
    { name: 'Security Patrol', href: '/security-patrol', icon: FaMapMarkedAlt },
    { name: 'Notifications', href: '/notifications', icon: FaBell },
    { name: 'Chatbot Editor', href: '/chatbot', icon: FaRobot },
    { name: 'Analytics', href: '/analytics', icon: FaChartLine },
    { name: 'Settings', href: '/settings', icon: FaCog },
  ];

  return (
    <div className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0">
      <div className="flex flex-col flex-grow pt-5 bg-indigo-700 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <span className="text-white text-2xl font-bold">SwiftAid Admin</span>
        </div>
        <div className="mt-5 flex-grow flex flex-col">
          <nav className="flex-1 px-2 pb-4 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-indigo-800 text-white'
                      : 'text-indigo-100 hover:bg-indigo-600'
                  }`
                }
              >
                <item.icon
                  className="mr-3 flex-shrink-0 h-6 w-6"
                  aria-hidden="true"
                />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="flex-shrink-0 flex border-t border-indigo-800 p-4">
          <button
            onClick={logout}
            className="flex-shrink-0 w-full group block"
          >
            <div className="flex items-center">
              <div>
                <svg
                  className="inline-block h-10 w-10 rounded-full text-indigo-200"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">Sign out</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar; 