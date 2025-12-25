import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function CustomerSetup() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [city, setCity] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      if (auth.currentUser) {
        const snap = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (snap.exists()) setName(snap.data().name);
      }
    };
    fetchUser();
  }, []);

  const handleNext = async () => {
    if(!city) return alert("Please enter city");
    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      location: { city },
      setupComplete: true
    });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-indigo-600 flex items-center justify-center text-white p-6">
      <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="max-w-md w-full text-center">
        <h1 className="text-5xl font-bold mb-4">Hii {name} 👋</h1>
        <p className="text-xl mb-8">What are you looking for today?</p>
        
        <div className="bg-white text-black p-6 rounded-xl shadow-2xl text-left">
          <label className="block text-sm font-bold text-gray-600 mb-2">Select Your City</label>
          <input 
            className="w-full p-3 border rounded bg-gray-50 mb-4" 
            placeholder="e.g. Mumbai, Delhi"
            onChange={(e) => setCity(e.target.value)}
          />
          <button onClick={handleNext} className="w-full bg-black text-white py-3 rounded font-bold hover:bg-gray-800">
            Show Recommendations
          </button>
        </div>
      </motion.div>
    </div>
  );
}