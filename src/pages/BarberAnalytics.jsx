import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { TrendingUp, Users, Bell, Check } from 'lucide-react';

export default function BarberAnalytics() {
  const [remindersSent, setRemindersSent] = useState({});

  const handleRemind = (id) => {
    setRemindersSent({ ...remindersSent, [id]: true });
    // In real app, this sends an SMS/Notification
  };

  const topServices = [
    { name: 'Haircut + Shave', count: 120, percent: '80%' },
    { name: 'Head Massage', count: 85, percent: '60%' },
    { name: 'Beard Trim', count: 45, percent: '30%' },
  ];

  const repeatingCustomers = [
    { id: 1, name: 'Rahul Gupta', visits: 12, lastVisit: '10 Days ago' },
    { id: 2, name: 'Amit Sharma', visits: 8, lastVisit: '25 Days ago' },
    { id: 3, name: 'Sneha Roy', visits: 5, lastVisit: '2 Months ago' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar role="barber" />
      
      <div className="max-w-6xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8 text-indigo-900">Analytics & CRM</h1>
        
        {/* 1. VISUAL CHARTS */}
        <div className="bg-white p-8 rounded-2xl shadow-lg mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><TrendingUp className="text-indigo-600"/> Most Popular Services</h2>
          <div className="space-y-6">
            {topServices.map((s, i) => (
              <div key={i}>
                <div className="flex justify-between mb-2 font-bold text-gray-700">
                  <span>{s.name}</span>
                  <span>{s.count} Sales</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div className="bg-indigo-600 h-4 rounded-full transition-all duration-1000" style={{ width: s.percent }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. REPEATING CUSTOMERS (CRM) */}
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Users className="text-green-600"/> Loyal Customers</h2>
          <p className="text-gray-500 mb-6">Send reminders to customers who haven't visited in a while.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repeatingCustomers.map((c) => (
              <div key={c.id} className="border-2 border-gray-100 p-6 rounded-xl hover:border-indigo-200 transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-xl">{c.name}</h3>
                    <p className="text-sm text-gray-500">{c.visits} Total Visits</p>
                  </div>
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded">VIP</span>
                </div>
                <p className="text-sm mb-4">Last seen: <span className="font-bold text-gray-700">{c.lastVisit}</span></p>
                
                <button 
                  onClick={() => handleRemind(c.id)}
                  className={`w-full py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition ${
                    remindersSent[c.id] ? 'bg-green-100 text-green-700' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {remindersSent[c.id] ? <><Check size={18}/> Reminder Sent!</> : <><Bell size={18}/> Send Reminder</>}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}