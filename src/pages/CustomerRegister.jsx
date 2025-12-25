import React, { useState, useEffect } from 'react';
import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber
} from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { useNavigate, Link } from 'react-router-dom';
import { Phone, ArrowRight, CheckCircle } from 'lucide-react';

export default function CustomerRegister() {
  const navigate = useNavigate();
  
  // State
  const [data, setData] = useState({ name: '', phone: '', password: '', email: '' });
  const [status, setStatus] = useState("");
  
  // OTP State
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);

  // --- THE FIX: RESET RECAPTCHA ON EVERY LOAD ---
  useEffect(() => {
    // 1. Clear any old verifier stuck in memory
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = null;
    }

    // 2. Create a brand new verifier attached to the CURRENT page
    try {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': () => {
          // Solved
        },
        'expired-callback': () => {
          setStatus("❌ Recaptcha expired. Refresh page.");
        }
      });
    } catch (e) {
      console.error("Recaptcha Init Error:", e);
    }

    // 3. Cleanup when leaving the page
    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    };
  }, []);
  // ---------------------------------------------

  const validatePhone = (number) => {
    if (!number) return "Phone number is empty.";
    const regex = /^[6-9][0-9]{9}$/; 
    if (!regex.test(number)) return "Invalid Number! Must be 10 digits & start with 6-9.";
    return null;
  };

  const handleSendOtp = async () => {
    setStatus("");

    if (!data.name || !data.password) {
      setStatus("❌ Enter Name and Password first.");
      return;
    }

    const error = validatePhone(data.phone);
    if (error) { setStatus("❌ " + error); return; }
    
    setStatus("⏳ Generating Recaptcha & Sending OTP...");
    
    try {
      const appVerifier = window.recaptchaVerifier;
      const phoneNumber = "+91" + data.phone; 

      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(confirmation);
      setOtpSent(true);
      setStatus(`✅ OTP sent to ${phoneNumber}`);
    } catch (error) {
      console.error(error);
      setStatus("🔥 SMS Error: " + error.message);
      
      // If error, reset recaptcha so they can try again
      if(window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
        // Re-init happens on reload, or we could manually re-init here. 
        // Simplest is to ask user to refresh if it persists, but usually this prevents the "removed" error.
      }
    }
  };

  const handleVerify = async () => {
    if (!otp || otp.length !== 6) {
      setStatus("❌ Enter valid 6-digit OTP.");
      return;
    }
    setStatus("⏳ Verifying OTP...");

    try {
      const result = await confirmationResult.confirm(otp);
      const user = result.user;

      await setDoc(doc(db, "users", user.uid), {
        type: 'customer',
        name: data.name,
        phone: data.phone,
        email: data.email || "", 
        authMethod: 'phone',
        setupComplete: false
      });

      setStatus("✅ Verified! Account Created.");
      setTimeout(() => navigate('/customer-setup'), 1000);

    } catch (error) {
      setStatus("❌ Invalid OTP. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-2 text-indigo-900">Sign Up</h2>
        <p className="text-gray-500 mb-6">Verify mobile to create account.</p>

        {status && (
          <div className={`p-3 mb-4 rounded-lg text-sm font-bold text-center ${status.includes("Error") || status.includes("❌") || status.includes("🔥") ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>
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

          {/* IMPORTANT: Recaptcha Container must be OUTSIDE conditional rendering */}
          <div id="recaptcha-container"></div>

          {!otpSent ? (
            <button onClick={handleSendOtp} className="w-full bg-black text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition shadow-lg">
              Send SMS OTP <ArrowRight size={18}/>
            </button>
          ) : (
            <div className="animate-fade-in bg-green-50 p-4 rounded-xl border border-green-200">
              <label className="block text-xs font-bold text-green-800 uppercase mb-2">Enter 6-Digit SMS Code</label>
              <div className="flex gap-2">
                <input 
                  className="flex-1 p-3 border border-green-200 rounded-lg text-center font-bold text-xl tracking-widest"
                  maxLength="6"
                  placeholder="000000"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                />
                <button onClick={handleVerify} className="bg-green-600 text-white px-6 rounded-lg font-bold hover:bg-green-700 shadow-md">
                  Verify
                </button>
              </div>
            </div>
          )}
          
          <Link to="/" className="block text-center text-sm text-gray-500 mt-4 hover:text-indigo-600">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}