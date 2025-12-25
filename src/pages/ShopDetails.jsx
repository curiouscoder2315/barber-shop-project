import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar'; // Using new Sidebar
import BookingModal from '../components/BookingModal'; // Using new Modal
import { Star, MapPin, Clock, Scissors, ArrowLeft } from 'lucide-react';

export default function ShopDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const shop = state?.shop;

  if (!shop) return <div>Data missing.</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Sidebar role="customer" />
      
      {/* Hero Header */}
      <div className="h-72 w-full bg-gray-900 relative">
        <img src={shop.image} alt={shop.shopName} className="w-full h-full object-cover opacity-60" />
        <button onClick={() => navigate(-1)} className="absolute top-20 left-6 bg-white p-2 rounded-full text-black z-20"><ArrowLeft /></button>
        <div className="absolute bottom-10 left-6 text-white z-20">
          <h1 className="text-5xl font-bold mb-2">{shop.shopName}</h1>
          <div className="flex items-center gap-4 text-lg">
            <span className="flex items-center bg-yellow-400 text-black px-3 py-1 rounded-lg font-bold"><Star size={16} className="mr-1" fill="black"/> {shop.rating}</span>
            <span className="text-gray-200">{shop.reviews} Reviews</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-12 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-indigo-900">About the Salon</h2>
          <p className="text-gray-600 leading-relaxed text-lg mb-6">{shop.description}</p>
          <div className="flex flex-wrap gap-6 text-gray-500 font-medium border-t pt-6">
            <span className="flex items-center"><Clock className="mr-2 text-indigo-600"/> {shop.schedule}</span>
            <span className="flex items-center"><MapPin className="mr-2 text-indigo-600"/> {shop.city}</span>
            <span className="flex items-center"><Scissors className="mr-2 text-indigo-600"/> Visit Charge: ₹{shop.personalVisitCharge}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-indigo-900">Select a Service</h2>
          <div className="space-y-4">
            {shop.services.map((s, i) => (
              <div key={i} className="flex justify-between items-center bg-gray-50 p-4 rounded-xl hover:bg-indigo-50 transition border border-transparent hover:border-indigo-200">
                <div>
                  <h3 className="font-bold text-lg">{s.name}</h3>
                  <p className="text-sm text-gray-500">Duration: 45 mins</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-xl text-gray-700">₹{s.price}</span>
                  <button onClick={() => setShowModal(true)} className="bg-black text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-800 transition shadow-lg">
                    Book
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* The Booking Wizard Modal */}
      {showModal && <BookingModal shop={shop} onClose={() => setShowModal(false)} />}
    </div>
  );
}