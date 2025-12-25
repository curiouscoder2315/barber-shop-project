import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Clock, CheckCircle, XCircle, ArrowRight } from 'lucide-react';

export default function BookingQueue() {
  // Converted to STATE to allow updates
  const [queue, setQueue] = useState([
    { id: 1, time: "10:00 AM", customer: "Rahul Gupta", service: "Haircut", price: 250, status: "Done" },
    { id: 2, time: "10:45 AM", customer: "Amit Sharma", service: "Beard Trim", price: 150, status: "Done" },
    { id: 3, time: "11:30 AM", customer: "Vikram Singh", service: "Head Massage", price: 300, status: "Current" }, // The Active One
    { id: 4, time: "12:30 PM", customer: "John Doe", service: "Haircut", price: 250, status: "Next" },
    { id: 5, time: "02:00 PM", customer: "Sneha Roy", service: "Facial", price: 800, status: "Pending" },
    { id: 6, time: "04:00 PM", customer: "Arjun Das", service: "Grooming", price: 1200, status: "Pending" },
  ]);

  // FUNCTION: Mark customer as Done
  const handleMarkDone = (id) => {
    const updatedQueue = queue.map((item) => {
      if (item.id === id) {
        return { ...item, status: "Done" };
      }
      // Optional: Automatically make the "Next" person "Current"
      if (item.status === "Next" && queue.find(q => q.id === id).status === "Current") {
        return { ...item, status: "Current" };
      }
      return item;
    });
    setQueue(updatedQueue);
  };

  // FUNCTION: Mark as No Show (Cancel)
  const handleNoShow = (id) => {
    if(!window.confirm("Mark this customer as No Show?")) return;
    
    const updatedQueue = queue.map((item) => {
      if (item.id === id) return { ...item, status: "Cancelled", price: 0 };
      return item;
    });
    setQueue(updatedQueue);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors">
      <Sidebar role="barber" />
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8 dark:text-white flex items-center gap-3">
          <Clock className="text-indigo-600"/> Today's Queue
        </h1>

        <div className="space-y-6">
          {queue.map((slot) => (
            <div key={slot.id} className={`relative flex gap-6 transition-all duration-500 ${slot.status === 'Done' || slot.status === 'Cancelled' ? 'opacity-50 grayscale' : ''}`}>
              
              {/* Timeline Line */}
              <div className="flex flex-col items-center">
                <div className={`w-4 h-4 rounded-full z-10 ${
                  slot.status === 'Current' ? 'bg-indigo-600 ring-4 ring-indigo-200 animate-pulse' : 
                  slot.status === 'Done' ? 'bg-green-500' : 'bg-gray-300'
                }`}></div>
                <div className="w-0.5 h-full bg-gray-200 dark:bg-slate-700 -mt-2"></div>
              </div>

              {/* Card */}
              <div className={`flex-1 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border-l-4 transition-all ${
                slot.status === 'Current' ? 'border-indigo-600 shadow-xl scale-105 ring-1 ring-indigo-100 z-10' : 
                slot.status === 'Cancelled' ? 'border-red-400 bg-red-50 dark:bg-red-900/10' :
                'border-gray-200 dark:border-slate-700'
              }`}>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">{slot.time}</span>
                    <h3 className={`text-xl font-bold dark:text-white mt-1 ${slot.status === 'Cancelled' ? 'line-through text-red-500' : ''}`}>
                      {slot.customer}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">{slot.service}</p>
                  </div>
                  <div className="text-right">
                     <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                       slot.status === 'Current' ? 'bg-indigo-100 text-indigo-700' : 
                       slot.status === 'Done' ? 'bg-green-100 text-green-700' :
                       slot.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                       'bg-gray-100 text-gray-600'
                     }`}>{slot.status}</span>
                     <p className="font-bold text-lg mt-2 dark:text-white">₹{slot.price}</p>
                  </div>
                </div>

                {/* ACTION BUTTONS (Only for Current or Next customers) */}
                {(slot.status === 'Current' || slot.status === 'Next') && (
                  <div className="flex gap-3 mt-5 pt-4 border-t dark:border-slate-700">
                    <button 
                      onClick={() => handleMarkDone(slot.id)}
                      className="flex-1 bg-green-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition shadow-md"
                    >
                      <CheckCircle size={18}/> Mark Done
                    </button>
                    <button 
                      onClick={() => handleNoShow(slot.id)}
                      className="flex-1 bg-white border border-red-200 text-red-600 py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-red-50 transition"
                    >
                      <XCircle size={18}/> No Show
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}