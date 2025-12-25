import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase/config';
import { Menu, X, Home, User, Scissors, LogOut, PieChart, Info, Phone } from 'lucide-react';

export default function Navbar({ role }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.signOut();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: <Home size={20} /> },
    { name: 'About Us', path: '/about', icon: <Info size={20} /> },
    { name: 'Contact', path: '/contact', icon: <Phone size={20} /> },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <Scissors size={24} />
            </div>
            <span className="font-bold text-xl text-indigo-900 tracking-tight">BarberConnect</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path} className="text-gray-600 hover:text-indigo-600 font-medium">
                {link.name}
              </Link>
            ))}
            
            {/* Dynamic Links Based on Role */}
            {role === 'barber' && (
              <Link to="/analytics" className="text-indigo-600 font-bold flex items-center gap-1">
                <PieChart size={18}/> My Sales
              </Link>
            )}
            
            {role ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard" className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full font-bold">Dashboard</Link>
                <button onClick={handleLogout} className="text-red-500 font-medium">Logout</button>
              </div>
            ) : (
              <Link to="/login" className="bg-indigo-600 text-white px-6 py-2 rounded-full font-bold hover:bg-indigo-700 transition">
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button (Hamburger) */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 focus:outline-none">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white shadow-xl border-t border-gray-100 p-4 flex flex-col space-y-4">
          {navLinks.map((link) => (
            <Link key={link.name} to={link.path} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg text-gray-700 font-medium" onClick={() => setIsOpen(false)}>
              {link.icon} {link.name}
            </Link>
          ))}
          
          <hr />
          
          {role === 'barber' && (
             <Link to="/analytics" className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg text-indigo-700 font-bold" onClick={() => setIsOpen(false)}>
               <PieChart size={20}/> Sales & History
             </Link>
          )}

          {role ? (
            <>
              <Link to="/dashboard" className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg text-indigo-700 font-bold" onClick={() => setIsOpen(false)}>
                <User size={20}/> My Dashboard
              </Link>
              <button onClick={handleLogout} className="flex items-center gap-3 p-3 text-red-600 font-medium w-full text-left">
                <LogOut size={20}/> Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="text-center bg-indigo-600 text-white py-3 rounded-lg font-bold" onClick={() => setIsOpen(false)}>
              Login / Sign Up
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}