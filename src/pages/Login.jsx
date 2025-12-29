import React, { useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail 
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { useNavigate, Link } from 'react-router-dom';
import { Scissors, Lock, Mail } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // --- HANDLER: EMAIL LOGIN ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("⏳ Logging in...");
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (error) {
      if(error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        setStatus("❌ Incorrect Email or Password.");
      } else {
        setStatus("❌ Login Failed: " + error.message);
      }
      setLoading(false);
    }
  };

  // --- HANDLER: FORGOT PASSWORD (Preserved) ---
  const handleForgotPassword = async () => {
    if (!email || !email.includes("@")) {
      setStatus("❌ Please enter your Email first.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setStatus("✅ Reset Link Sent to your Email!");
    } catch (e) {
      setStatus("❌ Error: " + e.message);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image (Preserved) */}
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
          <p className="text-gray-500 mb-6">Enter your email to continue.</p>

          {/* Status Box */}
          {status && (
            <div className={`p-4 mb-6 rounded-lg text-sm font-bold text-center ${status.includes("Error") || status.includes("❌") ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>
              {status}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
                <Mail className="absolute left-4 top-4 text-gray-400" size={20}/>
                <input 
                  className="w-full p-4 pl-12 border rounded-xl bg-gray-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" 
                  type="email"
                  placeholder="Email Address" 
                  value={email}
                  onChange={e => setEmail(e.target.value)} 
                />
            </div>

            <div className="relative">
                <Lock className="absolute left-4 top-4 text-gray-400" size={20}/>
                <input 
                  className="w-full p-4 pl-12 border rounded-xl bg-gray-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" 
                  type="password" 
                  placeholder="Password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)} 
                />
            </div>
            
            <div className="flex justify-end">
              <button type="button" onClick={handleForgotPassword} className="text-sm font-bold text-indigo-600 hover:text-indigo-800">
                Forgot Password?
              </button>
            </div>

            <button disabled={loading} type="submit" className="w-full bg-indigo-600 text-white p-4 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg flex items-center justify-center">
              {loading ? "Logging in..." : "Login to Account"}
            </button>
          </form>

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
          
        </div>
      </div>
    </div>
  );
}