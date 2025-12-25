import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase/config';
import { useTheme } from '../context/ThemeContext';
import { Menu, X, Home, Clock, PieChart, Users, Settings, LogOut, Scissors, Calendar, Sun, Moon, List, AlertTriangle } from 'lucide-react';

export default function Sidebar({ role }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false); // <--- NEW STATE
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // 1. Handle Logout Click
  const handleLogoutClick = () => {
    setIsOpen(false); // Close sidebar
    setShowLogoutConfirm(true); // Open Confirmation Modal
  };

  // 2. Perform Actual Logout
  const confirmLogout = async () => {
    await auth.signOut();
    setShowLogoutConfirm(false);
    navigate('/'); // Now they are allowed to go to Landing Page
  };

  const menuItems = role === 'barber' ? [
    { name: 'Command Center', path: '/dashboard', icon: <Home size={20}/> },
    { name: 'Today\'s Queue', path: '/queue', icon: <List size={20}/> },
    { name: 'Analytics & CRM', path: '/analytics', icon: <PieChart size={20}/> },
    { name: 'Customer History', path: '/barber-history', icon: <Users size={20}/> },
    { name: 'Shop Settings', path: '/settings', icon: <Settings size={20}/> },
  ] : [
    { name: 'Find Barbers', path: '/dashboard', icon: <Scissors size={20}/> },
    { name: 'My Bookings', path: '/history', icon: <Calendar size={20}/> },
    { name: 'Profile Settings', path: '/settings', icon: <Settings size={20}/> },
  ];

  return (
    <>
      {/* Top Bar */}
      <div className="bg-white dark:bg-slate-800 shadow-sm h-16 flex items-center justify-between px-6 sticky top-0 z-40 transition-colors">
        <div className="flex items-center gap-4">
          <button onClick={() => setIsOpen(true)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-700 dark:text-gray-200">
            <Menu size={28} />
          </button>
          <span className="font-bold text-xl text-indigo-900 dark:text-indigo-400">BarberConnect</span>
        </div>
        
        <button onClick={handleLogoutClick} className="flex items-center gap-2 text-red-500 font-bold hover:bg-red-50 dark:hover:bg-slate-700 px-3 py-1 rounded-lg transition">
          <span className="hidden md:inline">Logout</span>
          <LogOut size={20}/>
        </button>
      </div>

      {/* Slide-out Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
          <div className="relative bg-white dark:bg-slate-800 w-80 h-full shadow-2xl flex flex-col p-6 animate-slide-in transition-colors">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-indigo-900 dark:text-indigo-400">Menu</h2>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-red-50 rounded-full text-gray-500 hover:text-red-500">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 space-y-2">
              {menuItems.map((item, index) => (
                <Link 
                  key={index} 
                  to={item.path} 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-4 p-4 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-700 dark:hover:text-indigo-400 transition font-medium"
                >
                  {item.icon} {item.name}
                </Link>
              ))}
            </div>

            <div className="mt-auto pt-6 border-t dark:border-slate-700">
              <div className="flex items-center justify-between bg-gray-100 dark:bg-slate-900 p-4 rounded-2xl">
                <span className="font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  {darkMode ? <Moon size={18}/> : <Sun size={18}/>} 
                  {darkMode ? "Dark Mode" : "Light Mode"}
                </span>
                <button onClick={toggleTheme} className={`w-14 h-8 flex items-center bg-gray-300 dark:bg-indigo-600 rounded-full p-1 transition-colors duration-300`}>
                  <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${darkMode ? 'translate-x-6' : ''}`}></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- BEAUTIFUL LOGOUT POPUP --- */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm"></div>
          
          <div className="relative bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center animate-fade-in border border-gray-100 dark:border-slate-700">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
              <LogOut size={32} />
            </div>
            
            <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Log Out?</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              Are you sure you want to leave? You will need to login again to access your dashboard.
            </p>

            <div className="flex gap-4">
              <button 
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3 rounded-xl font-bold border border-gray-300 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition"
              >
                Cancel
              </button>
              <button 
                onClick={confirmLogout}
                className="flex-1 py-3 rounded-xl font-bold bg-red-500 text-white hover:bg-red-600 shadow-lg transition"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}