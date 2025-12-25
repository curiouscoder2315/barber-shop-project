import React, { useState } from 'react';
import { Calendar, Clock, CreditCard, CheckCircle, X, Loader } from 'lucide-react';
import { auth, db } from '../firebase/config'; // Import Firebase
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; // Import Firestore functions

export default function BookingModal({ shop, service, onClose }) {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state
  
  const slots = [
    { time: "10:00 AM", available: true },
    { time: "10:30 AM", available: false },
    { time: "11:00 AM", available: true },
    { time: "11:30 AM", available: true },
    { time: "12:00 PM", available: false },
    { time: "01:00 PM", available: true },
    { time: "02:00 PM", available: true },
    { time: "04:00 PM", available: false },
  ];

  const handleBook = async () => {
    if (!auth.currentUser) {
      alert("You must be logged in to book!");
      return;
    }

    setLoading(true);
    try {
      // SAVE TO FIREBASE
      await addDoc(collection(db, "bookings"), {
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName || "Customer",
        shopId: shop.id,
        shopName: shop.shopName,
        shopImage: shop.image || '',
        serviceName: service.name,
        servicePrice: service.price,
        date: date,
        time: selectedSlot,
        status: 'Upcoming', // Default status
        createdAt: serverTimestamp()
      });

      setLoading(false);
      setStep(4); // Show Success
    } catch (error) {
      console.error("Error booking:", error);
      setLoading(false);
      alert("Booking failed. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden">
        {/* Header */}
        <div className="bg-indigo-900 p-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Book Appointment</h2>
            <p className="text-indigo-200 text-sm">at {shop.shopName} • {service?.name}</p>
          </div>
          <button onClick={onClose} className="bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30"><X size={20}/></button>
        </div>

        <div className="p-6">
          {/* STEP 1: DATE */}
          {step === 1 && (
            <div className="animate-fade-in">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Calendar className="text-indigo-600"/> Select Date</h3>
              <input type="date" className="w-full p-4 border-2 border-indigo-100 rounded-xl text-lg font-medium outline-none focus:border-indigo-600 mb-6" onChange={(e) => setDate(e.target.value)} />
              <button disabled={!date} onClick={() => setStep(2)} className="w-full bg-black text-white py-4 rounded-xl font-bold disabled:opacity-50">Next: Select Time</button>
            </div>
          )}

          {/* STEP 2: SLOTS */}
          {step === 2 && (
            <div className="animate-fade-in">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Clock className="text-indigo-600"/> Select Time Slot</h3>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {slots.map((s, i) => (
                  <button 
                    key={i} 
                    disabled={!s.available}
                    onClick={() => setSelectedSlot(s.time)}
                    className={`p-3 rounded-lg text-sm font-bold border-2 transition ${
                      !s.available ? 'bg-gray-100 text-gray-400 border-transparent cursor-not-allowed' :
                      selectedSlot === s.time ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-200 hover:border-indigo-600'
                    }`}
                  >
                    {s.time}
                  </button>
                ))}
              </div>
              <button disabled={!selectedSlot} onClick={() => setStep(3)} className="w-full bg-black text-white py-4 rounded-xl font-bold disabled:opacity-50">Next: Payment</button>
            </div>
          )}

          {/* STEP 3: PAYMENT */}
          {step === 3 && (
            <div className="animate-fade-in">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><CreditCard className="text-indigo-600"/> Payment Mode</h3>
              
              <div className="bg-gray-50 p-4 rounded-xl mb-6">
                <div className="flex justify-between mb-2 text-sm text-gray-500"><span>Service Charge</span><span>₹{service.price}</span></div>
                <div className="flex justify-between font-bold text-lg"><span>Total Amount</span><span>₹{service.price}</span></div>
              </div>

              <div className="space-y-3 mb-6">
                <button onClick={handleBook} disabled={loading} className="w-full p-4 border rounded-xl flex items-center justify-between hover:bg-green-50 hover:border-green-500 group transition">
                  <span className="font-bold">Pay at Salon (Cash/UPI)</span>
                  {loading ? <Loader className="animate-spin text-indigo-600"/> : <span className="text-green-600 font-bold">Confirm Booking</span>}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: SUCCESS */}
          {step === 4 && (
            <div className="text-center py-8 animate-fade-in">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                <CheckCircle size={48} />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Booking Confirmed!</h2>
              <p className="text-gray-500 mb-6">Your slot at <span className="font-bold text-black">{shop.shopName}</span> is reserved.</p>
              <div className="bg-gray-50 p-4 rounded-xl mb-6 text-left">
                <p><strong>Service:</strong> {service.name}</p>
                <p><strong>Date:</strong> {date}</p>
                <p><strong>Time:</strong> {selectedSlot}</p>
              </div>
              <button onClick={onClose} className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold">Done</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}