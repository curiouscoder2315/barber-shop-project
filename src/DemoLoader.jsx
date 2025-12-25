import React, { useState } from 'react';
import { db } from './firebase/config';
import { collection, addDoc, writeBatch, doc } from 'firebase/firestore';

const demoShops = [
  {
    type: 'barber',
    name: 'Rajesh Verma',
    shopName: 'The Royal Cuts',
    city: 'Mumbai',
    image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800',
    rating: 4.8,
    reviews: 124,
    isOpen: true,
    personalVisitCharge: 200,
    schedule: "10:00 AM - 9:00 PM",
    services: [{name: 'Haircut', price: 250}, {name: 'Beard Trim', price: 150}, {name: 'Head Massage', price: 300}],
    description: "Premium grooming experience with 10+ years of experience. AC salon with free WiFi."
  },
  {
    type: 'barber',
    name: 'Sameer Khan',
    shopName: 'Urban Touch Salon',
    city: 'Mumbai',
    image: 'https://images.unsplash.com/photo-1503951914875-befbb7470d03?w=800',
    rating: 4.5,
    reviews: 89,
    isOpen: true,
    personalVisitCharge: 300,
    schedule: "9:00 AM - 10:00 PM",
    services: [{name: 'Fade Cut', price: 350}, {name: 'Facial', price: 800}],
    description: "Modern styling for the modern man. Specialists in fades and beard styling."
  },
  {
    type: 'barber',
    name: 'Vikram Singh',
    shopName: 'Scissors & Spice',
    city: 'Mumbai',
    image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800',
    rating: 4.2,
    reviews: 45,
    isOpen: false,
    personalVisitCharge: 150,
    schedule: "8:00 AM - 8:00 PM",
    services: [{name: 'Quick Cut', price: 150}, {name: 'Shave', price: 100}],
    description: "Budget friendly and quick service. Best for daily grooming."
  },
  {
    type: 'barber',
    name: 'Arjun Das',
    shopName: 'Golden Scissors',
    city: 'Mumbai',
    image: 'https://images.unsplash.com/photo-1599351431202-6e0c051dd26b?w=800',
    rating: 4.9,
    reviews: 210,
    isOpen: true,
    personalVisitCharge: 500,
    schedule: "11:00 AM - 7:00 PM",
    services: [{name: 'Groom Package', price: 2500}, {name: 'Styling', price: 800}],
    description: "Luxury salon visited by celebrities. Appointment only."
  },
  // Adding 6 more generic ones to hit the "10" count
  ...Array(6).fill(null).map((_, i) => ({
    type: 'barber',
    name: `Demo Barber ${i+1}`,
    shopName: `Style Studio ${i+1}`,
    city: 'Mumbai',
    image: 'https://images.unsplash.com/photo-1521490683712-35a1cb235d1c?w=800',
    rating: 4.0 + (i * 0.1),
    reviews: 20 + i * 5,
    isOpen: true,
    personalVisitCharge: 100 + i * 20,
    schedule: "9 AM - 9 PM",
    services: [{name: 'Haircut', price: 200}, {name: 'Shave', price: 100}],
    description: "Your friendly neighborhood barber shop."
  }))
];

export default function DemoLoader() {
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const batch = writeBatch(db);
      for (const barber of demoShops) {
        const ref = doc(collection(db, "users"));
        batch.set(ref, barber);
      }
      await batch.commit();
      alert("✅ 10+ Premium Shops Added to Database!");
    } catch (e) { alert("Error: " + e.message); }
    setLoading(false);
  };

  return (
    <button onClick={loadData} disabled={loading} className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-full font-bold shadow-2xl z-50 hover:scale-105 transition">
      {loading ? "Injecting Data..." : "⚡ LOAD 10 DEMO SHOPS"}
    </button>
  );
}