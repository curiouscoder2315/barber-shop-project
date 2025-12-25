import React, { useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  signInWithPhoneNumber, 
  RecaptchaVerifier, 
  sendPasswordResetEmail 
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { useNavigate, Link } from 'react-router-dom';
import { Scissors, Phone, Mail, ArrowRight, Lock, CheckCircle } from 'lucide-react';

export default function Login() {
  const [method, setMethod] = useState('phone'); // 'phone' or 'email'
  const [identifier, setIdentifier] = useState(''); // Phone or Email
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  // OTP State
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);

  // Initialize Recaptcha (Needed for Phone Login)
  useEffect(() => {
    // Clean up old verifier
    if (window.recaptchaVerifier) {
      try { window.recaptchaVerifier.clear(); } catch(e){}
      window.recaptchaVerifier = null;
    }
    // Create new one
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-login-container', {
      'size': 'invisible',
      'callback': () => {},
    });
  }, []);

  // --- HANDLER: SEND OTP (For Phone) ---
  const handleSendLoginOtp = async () => {
    if (!identifier || identifier.length < 10) {
      setStatus("❌ Enter a valid 10-digit phone number.");
      return;
    }
    
    setStatus("⏳ Sending OTP...");
    try {
      const appVerifier = window.recaptchaVerifier;
      const phoneNumber = "+91" + identifier; // Assuming +91
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(confirmation);
      setShowOtpInput(true);
      setStatus(`✅ OTP sent to ${phoneNumber}`);
    } catch (error) {
      console.error(error);
      setStatus("🔥 Error: " + error.message);
      // Reset captcha if needed
      if(window.recaptchaVerifier) window.recaptchaVerifier.clear();
    }
  };

  // --- HANDLER: VERIFY OTP ---
  const handleVerifyOtp = async () => {
    setStatus("⏳ Verifying...");
    try {
      await confirmationResult.confirm(otp);
      navigate('/dashboard');
    } catch (error) {
      setStatus("❌ Invalid Code.");
    }
  };

  // --- HANDLER: EMAIL/PASSWORD LOGIN ---
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setStatus("⏳ Logging in...");
    try {
      await signInWithEmailAndPassword(auth, identifier, password);
      navigate('/dashboard');
    } catch (error) {
      setStatus("❌ Login Failed: " + error.message);
    }
  };

  // --- HANDLER: FORGOT PASSWORD ---
  const handleForgotPassword = async () => {
    if (!identifier.includes("@")) {
      setStatus("❌ For 'Forgot Password', please enter your Email.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, identifier);
      setStatus("✅ Reset Link Sent to your Email!");
    } catch (e) {
      setStatus("❌ Error: " + e.message);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:flex w-1/2 bg-indigo-900 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-40 z-10"></div>
        <img src="https://images.unsplash.com/photo-1503951914875-befbb7470d03?w=1600" className="absolute inset-0 w-full h-full object-cover" />
        <div className="relative z-20 text-white p-12">
          <h1 className="text-6xl font-bold mb-6">Welcome Back.</h1>
          <p className="text-xl text-gray-200">Manage your style with BarberConnect.</p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white dark:bg-slate-900 p-8 transition-colors">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-8">
            <div className="bg-indigo-600 p-2 rounded-lg text-white"><Scissors size={24} /></div>
            <span className="font-bold text-xl text-indigo-900 dark:text-white">BarberConnect</span>
          </div>

          <h2 className="text-3xl font-bold mb-2 dark:text-white">Login</h2>
          <p className="text-gray-500 mb-6">Choose your preferred method.</p>

          {/* Login Method Toggle */}
          <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-xl mb-6">
            <button 
              onClick={() => {setMethod('phone'); setShowOtpInput(false); setStatus("");}}
              className={`flex-1 py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition ${method === 'phone' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 dark:text-gray-400'}`}
            >
              <Phone size={16}/> Phone (OTP)
            </button>
            <button 
              onClick={() => {setMethod('email'); setShowOtpInput(false); setStatus("");}}
              className={`flex-1 py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition ${method === 'email' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 dark:text-gray-400'}`}
            >
              <Mail size={16}/> Email (Password)
            </button>
          </div>

          {/* Status Box */}
          {status && (
            <div className={`p-4 mb-6 rounded-lg text-sm font-bold text-center ${status.includes("Error") || status.includes("❌") ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>
              {status}
            </div>
          )}

          {/* --- PHONE LOGIN FLOW --- */}
          {method === 'phone' && (
            <div className="space-y-4">
              {!showOtpInput ? (
                <>
                  <div className="relative">
                    <span className="absolute left-4 top-4 text-gray-500 font-bold">+91</span>
                    <input 
                      className="w-full p-4 pl-14 border rounded-xl bg-gray-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white font-bold tracking-widest outline-none focus:ring-2 focus:ring-indigo-500" 
                      type="tel"
                      maxLength="10"
                      placeholder="9999999999" 
                      value={identifier}
                      onChange={e => setIdentifier(e.target.value.replace(/\D/g, ''))} 
                    />
                  </div>
                  <button onClick={handleSendLoginOtp} className="w-full bg-black dark:bg-indigo-600 text-white p-4 rounded-xl font-bold hover:bg-gray-800 dark:hover:bg-indigo-700 transition flex items-center justify-center shadow-lg">
                    Get OTP <ArrowRight size={18} className="ml-2"/>
                  </button>
                  <p className="text-xs text-center text-gray-400 mt-2">Use Test Number <b>9999999999</b> / OTP <b>123456</b></p>
                </>
              ) : (
                <div className="animate-fade-in bg-indigo-50 dark:bg-slate-800 p-6 rounded-xl border border-indigo-100 dark:border-slate-700">
                  <label className="block text-xs font-bold text-indigo-800 dark:text-indigo-400 uppercase mb-2">Enter OTP Code</label>
                  <div className="flex gap-2">
                    <input 
                      className="flex-1 p-3 border border-indigo-300 dark:border-slate-600 rounded-lg text-center font-bold text-2xl tracking-[0.5em] bg-white dark:bg-slate-700 dark:text-white"
                      maxLength="6"
                      placeholder="000000"
                      value={otp}
                      onChange={e => setOtp(e.target.value)}
                      autoFocus
                    />
                  </div>
                  <button onClick={handleVerifyOtp} className="w-full bg-green-600 text-white mt-4 p-3 rounded-lg font-bold hover:bg-green-700 shadow-md flex items-center justify-center gap-2">
                    <CheckCircle size={20}/> Verify & Login
                  </button>
                  <button onClick={() => setShowOtpInput(false)} className="w-full text-center text-gray-500 mt-4 text-sm underline">Change Number</button>
                </div>
              )}
            </div>
          )}

          {/* --- EMAIL LOGIN FLOW --- */}
          {method === 'email' && (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <input 
                className="w-full p-4 border rounded-xl bg-gray-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" 
                placeholder="Email Address" 
                value={identifier}
                onChange={e => setIdentifier(e.target.value)} 
              />
              <input 
                className="w-full p-4 border rounded-xl bg-gray-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={e => setPassword(e.target.value)} 
              />
              
              <div className="flex justify-end">
                <button type="button" onClick={handleForgotPassword} className="text-sm font-bold text-indigo-600 hover:text-indigo-800">
                  Forgot Password?
                </button>
              </div>

              <button type="submit" className="w-full bg-indigo-600 text-white p-4 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg flex items-center justify-center">
                Login with Password <Lock size={18} className="ml-2"/>
              </button>
            </form>
          )}

          <div className="mt-8 text-center border-t pt-6 dark:border-slate-800">
            <p className="text-gray-500 mb-4">Don't have an account?</p>
            <div className="grid grid-cols-2 gap-4">
              <Link to="/register-barber" className="text-center p-3 border dark:border-slate-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 text-sm font-bold text-gray-600 dark:text-gray-300">
                Join as Barber
              </Link>
              <Link to="/register-customer" className="text-center p-3 border dark:border-slate-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 text-sm font-bold text-gray-600 dark:text-gray-300">
                Join as Customer
              </Link>
            </div>
          </div>
          
          {/* Recaptcha Container */}
          <div id="recaptcha-login-container"></div>
        </div>
      </div>
    </div>
  );
}