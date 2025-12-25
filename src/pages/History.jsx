import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Calendar, CheckCircle } from 'lucide-react';

export default function History() {
  const [tab, setTab] = useState('upcoming'); // 'upcoming' or 'past'

  const upcoming = [
    { name: 'Royal Cuts Studio', service: 'Haircut', date: 'Tomorrow, 10:00 AM', status: 'Confirmed' }
  ];

  const past = [
    { name: 'Urban Touch', service: 'Beard Trim', date: '12 Dec 2023', status: 'Completed', price: 150 },
    { name: 'Styles By John', service: 'Head Massage', date: '01 Nov 2023', status: 'Completed', price: 300 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar role="customer" />
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

        <div className="flex gap-4 mb-8">
          <button onClick={() => setTab('upcoming')} className={`px-6 py-2 rounded-full font-bold ${tab==='upcoming' ? 'bg-black text-white' : 'bg-white text-gray-500'}`}>Upcoming</button>
          <button onClick={() => setTab('past')} className={`px-6 py-2 rounded-full font-bold ${tab==='past' ? 'bg-black text-white' : 'bg-white text-gray-500'}`}>Past History</button>
        </div>

        <div className="space-y-4">
          {(tab === 'upcoming' ? upcoming : past).map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm flex justify-between items-center border-l-4 border-indigo-600">
              <div>
                <h3 className="font-bold text-xl">{item.name}</h3>
                <p className="text-gray-500">{item.service} • {item.date}</p>
              </div>
              <div className="text-right">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">{item.status}</span>
                {item.price && <p className="font-bold text-lg mt-1">₹{item.price}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}