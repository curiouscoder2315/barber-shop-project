import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, UserPlus } from 'lucide-react';

export default function CustomerRegister() {
  const navigate = useNavigate();
  
  // State
  const [data, setData] = useState({ name: '', phone: '', email: '', password: '' });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  
  const handleRegister = async () => {
    setStatus("");

    // Validation
    if (!data.name || !data.password || !data.email) {
      setStatus("❌ Enter Name, Email and Password.");
      return;
    }
    if (data.password.length < 6) {
      setStatus("❌ Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setStatus("⏳ Creating Account...");
    
    try {
      // 1. Create Auth User
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      // 2. Save User Data (Preserving phone as data)
      await setDoc(doc(db, "users", user.uid), {
        type: 'customer',
        uid: user.uid,
        name: data.name,
        phone: data.phone, // Saved to database
        email: data.email, 
        authMethod: 'email',
        setupComplete: false
      });

      setStatus("✅ Verified! Account Created.");
      setTimeout(() => navigate('/customer-setup'), 1000);

    } catch (error) {
      console.error(error);
      if(error.code === 'auth/email-already-in-use') {
        setStatus("❌ Email already exists.");
      } else {
        setStatus("❌ Error: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-2 text-indigo-900">Sign Up</h2>
        <p className="text-gray-500 mb-6">Create a customer account.</p>

        {status && (
          <div className={`p-3 mb-4 rounded-lg text-sm font-bold text-center ${status.includes("Error") || status.includes("❌") ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>
            {status}
          </div>
        )}

        <div className="space-y-4">
          <input 
            className="w-full p-4 border rounded-xl bg-gray-50" 
            placeholder="Full Name" 
            value={data.name}
            onChange={e => setData({...data, name: e.target.value})} 
          />
          
          <input 
            className="w-full p-4 border rounded-xl bg-gray-50" 
            placeholder="Email Address" 
            type="email"
            value={data.email}
            onChange={e => setData({...data, email: e.target.value})} 
          />
          
          <input 
            className="w-full p-4 border rounded-xl bg-gray-50" 
            type="password" 
            placeholder="Create Password" 
            value={data.password}
            onChange={e => setData({...data, password: e.target.value})} 
          />

          <div className="relative">
            <span className="absolute left-4 top-4 text-gray-500 font-bold">+91</span>
            <input 
              className="w-full p-4 pl-14 border rounded-xl bg-gray-50 font-bold tracking-widest" 
              type="tel"
              maxLength="10"
              placeholder="9876543210" 
              value={data.phone}
              onChange={e => {
                 const val = e.target.value.replace(/\D/g, '');
                 setData({...data, phone: val});
              }} 
            />
          </div>

          <button disabled={loading} onClick={handleRegister} className="w-full bg-black text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition shadow-lg">
             {loading ? "Processing..." : <><UserPlus size={18}/> Create Account</>}
          </button>
          
          <Link to="/" className="block text-center text-sm text-gray-500 mt-4 hover:text-indigo-600">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}