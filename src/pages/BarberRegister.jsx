import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Trash2, ArrowLeft, Store } from 'lucide-react';

export default function BarberRegister() {
  const navigate = useNavigate();
  
  // UI State
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Data State
  const [formData, setFormData] = useState({ 
    name: '', 
    shopName: '', 
    city: '', 
    phone: '', 
    email: '', 
    password: '' 
  });
  const [services, setServices] = useState([{ name: '', price: '' }]);

  // --- UPDATED: VALIDATION LOGIC ---
  const handleNextStep = () => {
    // 1. Check Mandatory Fields (Removed formData.phone from here)
    if(!formData.name || !formData.shopName || !formData.city || !formData.email || !formData.password) {
      setStatus("❌ Please fill in all required fields (Name, Shop, City, Email, Password).");
      return;
    }

    // 2. Strict Email Validation Regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setStatus("❌ Invalid Email Format. Please enter a valid email (e.g., name@gmail.com).");
      return;
    }
    
    // 3. Password Check
    if(formData.password.length < 6) {
      setStatus("❌ Password must be at least 6 characters.");
      return;
    }

    // 4. All Good -> Go to Step 2
    setStatus(""); 
    setStep(2); 
  };

  // Handle Service Changes
  const handleServiceChange = (i, field, value) => {
    const newS = [...services];
    newS[i][field] = value;
    setServices(newS);
  };

  // Register Shop
  const handleRegister = async () => {
    setLoading(true);
    setStatus("⏳ Creating Shop Account...");

    try {
      // Create User in Auth
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // Save Data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        type: 'barber',
        uid: user.uid,
        name: formData.name,
        phone: formData.phone || "", // Save empty string if not provided
        email: formData.email,
        shopName: formData.shopName,
        city: formData.city,
        services: services,
        authMethod: 'email',
        isOpen: true,
        personalVisitCharge: 0,
        schedule: "9 AM - 9 PM"
      });

      setStatus("✅ Success! Welcome to BarberConnect.");
      setTimeout(() => navigate('/dashboard'), 1500);

    } catch (error) {
      console.error(error);
      if(error.code === 'auth/email-already-in-use') {
        setStatus("❌ This email is already registered.");
      } else {
        setStatus("❌ Error: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 mt-8 bg-white shadow-xl rounded-2xl border border-gray-100 relative">
      <Link to="/" className="flex items-center text-gray-500 mb-6 font-bold hover:text-indigo-600"><ArrowLeft size={20}/> Back</Link>
      <h2 className="text-3xl font-bold mb-2 text-indigo-900">Partner Registration</h2>
      <p className="text-gray-500 mb-6">Step {step} of 2: {step === 1 ? "Shop Details" : "Services & Confirm"}</p>

      {/* Status Box */}
      {status && (
        <div className={`p-4 mb-6 rounded-lg font-bold text-center ${status.includes("Error") || status.includes("❌") ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>
          {status}
        </div>
      )}

      {/* STEP 1 */}
      {step === 1 ? (
        <div className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-2 gap-4">
            <input className="w-full p-4 border rounded-xl bg-gray-50" placeholder="Your Full Name *" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            <input className="w-full p-4 border rounded-xl bg-gray-50" placeholder="Shop Name *" value={formData.shopName} onChange={e => setFormData({...formData, shopName: e.target.value})} />
          </div>
          <input className="w-full p-4 border rounded-xl bg-gray-50" placeholder="City *" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
          
          <input 
            className="w-full p-4 border rounded-xl bg-gray-50" 
            placeholder="Email Address *" 
            type="email"
            value={formData.email} 
            onChange={e => setFormData({...formData, email: e.target.value})} 
          />

          <div className="relative">
            <span className="absolute left-4 top-4 text-gray-500 font-bold">+91</span>
            <input 
              className="w-full p-4 pl-14 border rounded-xl bg-gray-50 font-bold tracking-widest" 
              type="tel"
              maxLength="10"
              placeholder="Phone Number (Optional)" 
              value={formData.phone}
              onChange={e => {
                const val = e.target.value.replace(/\D/g, '');
                setFormData({...formData, phone: val});
              }} 
            />
          </div>

          <input className="w-full p-4 border rounded-xl bg-gray-50" type="password" placeholder="Create Password *" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
          
          <button onClick={handleNextStep} className="w-full bg-indigo-600 text-white p-4 rounded-xl font-bold hover:bg-indigo-700 shadow-lg mt-4 transition">
            Next: Add Services
          </button>
        </div>
      ) : (
        /* STEP 2 */
        <div className="animate-fade-in">
          <h3 className="text-xl font-bold mb-4 text-gray-700">Add Your Services</h3>
          {services.map((s, i) => (
            <div key={i} className="flex gap-3 mb-3">
              <input placeholder="Service Name" className="flex-1 p-3 border rounded-xl bg-gray-50" value={s.name} onChange={e => handleServiceChange(i, 'name', e.target.value)} />
              <input placeholder="Price" type="number" className="w-32 p-3 border rounded-xl bg-gray-50" value={s.price} onChange={e => handleServiceChange(i, 'price', e.target.value)} />
              {services.length > 1 && <button onClick={() => setServices(services.filter((_, idx) => idx !== i))} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2/></button>}
            </div>
          ))}
          <button onClick={() => setServices([...services, {name:'', price:''}])} className="flex items-center text-indigo-600 font-bold mt-2 mb-8 hover:bg-indigo-50 p-2 rounded"><Plus size={18} className="mr-1"/> Add Another Service</button>
          
          <div className="flex gap-4">
            <button onClick={() => setStep(1)} className="w-1/3 border border-gray-300 text-gray-600 p-4 rounded-xl font-bold hover:bg-gray-50">Back</button>
            <button disabled={loading} onClick={handleRegister} className="w-2/3 bg-black text-white p-4 rounded-xl font-bold hover:bg-gray-800 shadow-lg flex items-center justify-center gap-2">
              {loading ? "Creating Shop..." : <><Store size={18}/> Create Shop Account</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}