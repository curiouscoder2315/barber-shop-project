import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import BookingModal from '../components/BookingModal';
import { Star, MapPin, Clock, Scissors, ArrowLeft, Users, Hourglass } from 'lucide-react';

export default function ShopDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const shop = state?.shop;

  if (!shop) return <div>Data missing.</div>;

  // Constants for calc
  const AVG_QUEUE_TIME_PER_PERSON = 20; // 20 mins per person
  const currentQueueWait = shop.queueLength * AVG_QUEUE_TIME_PER_PERSON;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Sidebar role="customer" />
      
      {/* Hero Header */}
      <div className="h-80 w-full bg-gray-900 relative">
        <img src={shop.image} alt={shop.shopName} className="w-full h-full object-cover opacity-50" />
        <button onClick={() => navigate(-1)} className="absolute top-8 left-6 bg-white/20 hover:bg-white/40 backdrop-blur-md p-3 rounded-full text-white z-20 transition">
          <ArrowLeft />
        </button>
        
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-gray-900 to-transparent h-32"></div>

        <div className="absolute bottom-10 left-6 right-6 text-white z-20 flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">{shop.shopName}</h1>
            <p className="flex items-center gap-2 text-gray-300 text-sm md:text-base">
              <MapPin size={18} className="text-indigo-400"/> {shop.address}, {shop.city}
            </p>
          </div>
          <div className="flex items-center gap-3">
             <div className="text-right">
                <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Rating</p>
                <div className="flex items-center gap-2 text-xl font-bold text-yellow-400">
                  <Star fill="currentColor" /> {shop.rating}
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-8 relative z-10">
        
        {/* LIVE STATUS CARD */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border-l-8 border-indigo-600 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-50 p-4 rounded-full">
              <Users className="text-indigo-600" size={32} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase">Live Queue</p>
              <h3 className="text-3xl font-extrabold text-gray-900">{shop.queueLength} People <span className="text-lg font-normal text-gray-400">waiting</span></h3>
            </div>
          </div>
          
          <div className="hidden md:block w-px h-12 bg-gray-200"></div>

          <div className="flex items-center gap-4">
            <div className="bg-yellow-50 p-4 rounded-full">
              <Hourglass className="text-yellow-600" size={32} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase">Est. Wait Time</p>
              <h3 className="text-3xl font-extrabold text-gray-900">{currentQueueWait} <span className="text-lg font-normal text-gray-400">mins</span></h3>
            </div>
          </div>

          <div className="bg-green-50 px-6 py-3 rounded-xl border border-green-100">
             <p className="text-xs font-bold text-green-800 uppercase mb-1">Status</p>
             <p className="font-bold text-green-600 flex items-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Shop is Open</p>
          </div>
        </div>

        {/* DETAILS & SERVICES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Column: Info */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4">About the Shop</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">{shop.description}</p>
              <div className="space-y-3 text-sm font-medium text-gray-500">
                <div className="flex items-center gap-3"><Clock size={16} className="text-indigo-600"/> {shop.schedule}</div>
                <div className="flex items-center gap-3"><Scissors size={16} className="text-indigo-600"/> Home Visit: ₹{shop.personalVisitCharge}</div>
              </div>
            </div>
          </div>

          {/* Right Column: Services */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Select a Service</h3>
            <div className="space-y-4">
              {shop.services.map((s, i) => {
                const myServiceWait = currentQueueWait + (s.time || 20);
                return (
                  <div key={i} className="flex flex-col sm:flex-row justify-between items-center bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition border border-gray-100">
                    <div className="mb-4 sm:mb-0 text-center sm:text-left">
                      <h3 className="font-bold text-lg text-gray-800">{s.name}</h3>
                      <div className="flex items-center justify-center sm:justify-start gap-4 text-xs font-bold mt-1">
                        <span className="text-gray-400 bg-gray-100 px-2 py-1 rounded flex items-center gap-1"><Clock size={10}/> {s.time} mins</span>
                        <span className="text-indigo-400 bg-indigo-50 px-2 py-1 rounded">Total time: ~{myServiceWait} mins</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="font-bold text-2xl text-gray-700">₹{s.price}</span>
                      <button onClick={() => setShowModal(true)} className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition shadow-lg transform active:scale-95">
                        Book
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {showModal && <BookingModal shop={shop} onClose={() => setShowModal(false)} />}
    </div>
  );
}