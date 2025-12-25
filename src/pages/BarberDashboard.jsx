import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { auth, db } from '../firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Users, DollarSign, TrendingUp, ArrowRight, Clock, Power, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BarberDashboard() {
  const [barberName, setBarberName] = useState("Barber");
  const [shopName, setShopName] = useState("Your Shop"); // State for Shop Name
  const [isOnline, setIsOnline] = useState(true);
  const [loadingStatus, setLoadingStatus] = useState(false);
  
  // Widget Queue State
  const [todaysQueue, setTodaysQueue] = useState([
    { id: 101, time: "10:00 AM", name: "Rahul Gupta", service: "Haircut", status: "Completed", color: "green" },
    { id: 102, time: "11:00 AM", name: "Amit Sharma", service: "Beard Trim", status: "In Chair", color: "blue" },
    { id: 103, time: "12:00 PM", name: "Sneha Roy", service: "Massage", status: "Upcoming", color: "yellow" },
    { id: 104, time: "02:00 PM", name: "Vikram Singh", service: "Full Package", status: "Upcoming", color: "gray" },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      if (auth.currentUser) {
        try {
          const snap = await getDoc(doc(db, "users", auth.currentUser.uid));
          if (snap.exists()) {
            const data = snap.data();
            setBarberName(data.name || "Barber");
            setShopName(data.shopName || "Your Shop"); // Fetch Shop Name
            setIsOnline(data.isOpen !== undefined ? data.isOpen : true);
          }
        } catch (error) {
          console.error("Error:", error);
        }
      }
    };
    fetchData();
  }, []);

  const toggleOnlineStatus = async () => {
    if (!auth.currentUser) return;
    setLoadingStatus(true);
    const newStatus = !isOnline;
    try {
      await updateDoc(doc(db, "users", auth.currentUser.uid), { isOpen: newStatus });
      setIsOnline(newStatus);
    } catch (e) { alert("Error: " + e.message); }
    setLoadingStatus(false);
  };

  const handleQuickMarkDone = (id) => {
    const updated = todaysQueue.map(item => item.id === id ? { ...item, status: 'Completed' } : item);
    setTodaysQueue(updated);
  };

  const stats = { todaySales: 4500, todayAppointments: 12, pending: todaysQueue.filter(q => q.status !== 'Completed').length, monthlyRevenue: 125000 };

  return (
    <div className="pb-12 bg-gray-50 dark:bg-slate-900 min-h-screen transition-colors">
      <Sidebar role="barber" />
      
      {/* --- BEAUTIFUL HEADER SECTION --- */}
      <div className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 shadow-sm mb-8">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-gray-500 dark:text-gray-400 font-bold mb-1 uppercase tracking-wider text-sm">Dashboard</p>
              
              {/* FIX APPLIED HERE: Added 'pb-2' to prevent clipping of letters like g, j, y */}
              <h1 className="text-4xl md:text-5xl font-extrabold mb-2 pb-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                {shopName}
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 font-medium">
                Welcome back, <span className="text-indigo-600 dark:text-indigo-400">{barberName}</span> 👋
              </p>
            </div>

             {/* STATUS BADGE */}
            <div className={`px-6 py-3 rounded-2xl font-bold flex items-center gap-3 shadow-sm border ${isOnline ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400' : 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400'}`}>
              <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              {isOnline ? "SHOP IS ONLINE" : "SHOP IS OFFLINE"}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border-l-4 border-green-500">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-500 dark:text-gray-400 text-sm font-bold">TODAY'S SALES</span>
              <DollarSign className="text-green-500" size={20}/>
            </div>
            <h3 className="text-3xl font-bold dark:text-white">₹{stats.todaySales}</h3>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border-l-4 border-blue-500">
             <div className="flex justify-between items-center mb-2">
              <span className="text-gray-500 dark:text-gray-400 text-sm font-bold">APPOINTMENTS</span>
              <Users className="text-blue-500" size={20}/>
            </div>
            <h3 className="text-3xl font-bold dark:text-white">{stats.todayAppointments}</h3>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border-l-4 border-yellow-500">
             <div className="flex justify-between items-center mb-2">
              <span className="text-gray-500 dark:text-gray-400 text-sm font-bold">PENDING</span>
              <Clock className="text-yellow-500" size={20}/>
            </div>
            <h3 className="text-3xl font-bold dark:text-white">{stats.pending}</h3>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border-l-4 border-purple-500">
             <div className="flex justify-between items-center mb-2">
              <span className="text-gray-500 dark:text-gray-400 text-sm font-bold">TOTAL REVENUE</span>
              <TrendingUp className="text-purple-500" size={20}/>
            </div>
            <h3 className="text-3xl font-bold dark:text-white">₹{stats.monthlyRevenue}</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* QUEUE WIDGET */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold dark:text-white">Today's Schedule</h2>
              <Link to="/queue" className="text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1 hover:underline">
                View Full Queue <ArrowRight size={16}/>
              </Link>
            </div>
            
            <div className="space-y-4">
              {todaysQueue.map((slot) => (
                <div key={slot.id} className="flex items-center p-4 bg-gray-50 dark:bg-slate-700 rounded-xl transition hover:bg-gray-100 dark:hover:bg-slate-600">
                  <div className="font-bold text-lg w-24 text-gray-500 dark:text-gray-300">{slot.time}</div>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg dark:text-white">{slot.name}</h4>
                    <p className="text-sm text-indigo-600 dark:text-indigo-400">{slot.service}</p>
                  </div>
                  
                  {slot.status === 'Completed' ? (
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-green-100 text-green-700">Completed</span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${slot.status === 'In Chair' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {slot.status}
                      </span>
                      {slot.status === 'In Chair' && (
                        <button onClick={() => handleQuickMarkDone(slot.id)} className="bg-green-600 p-1.5 rounded-full text-white hover:bg-green-700" title="Mark Done">
                          <CheckCircle size={16}/>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* CONTROL PANEL */}
          <div className="bg-indigo-900 text-white rounded-2xl shadow-lg p-8 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-5 rounded-full"></div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Shop Controls</h2>
              <p className="text-indigo-200 mb-6">
                {isOnline ? "Your shop is visible in search results." : "You are currently hidden from search."}
              </p>
            </div>
            <button 
              onClick={toggleOnlineStatus}
              disabled={loadingStatus}
              className={`w-full py-4 rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-lg ${isOnline ? 'bg-white text-red-600 hover:bg-red-50' : 'bg-green-500 text-white hover:bg-green-600'}`}
            >
              <Power size={20}/>
              {loadingStatus ? "Updating..." : (isOnline ? "Go Offline" : "Go Online")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}