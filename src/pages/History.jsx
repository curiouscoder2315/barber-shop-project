import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { auth, db } from '../firebase/config';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { Calendar, Clock, Loader } from 'lucide-react';

export default function History() {
  const [tab, setTab] = useState('upcoming'); // 'upcoming' or 'past'
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!auth.currentUser) return;

      try {
        // Query: Get bookings for this user
        const q = query(
          collection(db, "bookings"),
          where("userId", "==", auth.currentUser.uid)
          // Note: 'orderBy' might require a Firestore index. If it fails, remove orderBy and sort in JS.
        );

        const querySnapshot = await getDocs(q);
        const fetchedData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setBookings(fetchedData);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Filter Data
  const upcoming = bookings.filter(b => b.status === 'Upcoming');
  const past = bookings.filter(b => b.status === 'Completed' || b.status === 'Cancelled');

  const displayData = tab === 'upcoming' ? upcoming : past;

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar role="customer" />
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

        <div className="flex gap-4 mb-8">
          <button onClick={() => setTab('upcoming')} className={`px-6 py-2 rounded-full font-bold transition ${tab==='upcoming' ? 'bg-black text-white' : 'bg-white text-gray-500'}`}>Upcoming</button>
          <button onClick={() => setTab('past')} className={`px-6 py-2 rounded-full font-bold transition ${tab==='past' ? 'bg-black text-white' : 'bg-white text-gray-500'}`}>History</button>
        </div>

        {loading ? (
          <div className="flex justify-center p-10"><Loader className="animate-spin text-indigo-600" size={40}/></div>
        ) : displayData.length === 0 ? (
          <div className="text-center p-10 bg-white rounded-2xl border-dashed border-2 border-gray-200">
             <p className="text-gray-400 font-bold">No {tab} bookings found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayData.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition flex flex-col md:flex-row justify-between items-center border-l-4 border-indigo-600">
                <div className="mb-4 md:mb-0">
                  <h3 className="font-bold text-xl">{item.shopName}</h3>
                  <div className="flex flex-col gap-1 text-gray-500 mt-1">
                     <span className="flex items-center gap-2"><Calendar size={14}/> {item.date}</span>
                     <span className="flex items-center gap-2"><Clock size={14}/> {item.time}</span>
                  </div>
                  <p className="text-indigo-600 font-bold text-sm mt-2 bg-indigo-50 inline-block px-2 py-1 rounded">{item.serviceName}</p>
                </div>
                
                <div className="text-right flex flex-col items-end">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase mb-2 ${
                    item.status === 'Upcoming' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {item.status}
                  </span>
                  <p className="font-bold text-2xl">₹{item.servicePrice}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}