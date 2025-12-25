import React, { useState, useEffect } from 'react';
import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber
} from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Trash2, ArrowLeft, Phone, CheckCircle } from 'lucide-react';

export default function BarberRegister() {
  const navigate = useNavigate();
  
  // UI State
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState("");
  
  // Data State
  const [formData, setFormData] = useState({ name: '', phone: '', password: '', shopName: '', city: '' });
  const [services, setServices] = useState([{ name: '', price: '' }]);

  // OTP State
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);

  // --- THE FIX: RESET RECAPTCHA ON EVERY LOAD ---
  useEffect(() => {
    // 1. Clear any old verifier stuck in memory
    if (window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier.clear();
      } catch (e) {
        // Ignore error if it was already cleared
      }
      window.recaptchaVerifier = null;
    }

    // 2. Create a brand new verifier attached to the CURRENT page
    try {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response) => {
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
        try {
          window.recaptchaVerifier.clear();
        } catch (e) {}
        window.recaptchaVerifier = null;
      }
    };
  }, []); // Run once on mount

  // 2. Strict Phone Validation
  const validatePhone = (number) => {
    if (!number) return "Phone number is empty.";
    const regex = /^[6-9][0-9]{9}$/; 
    if (!regex.test(number)) {
      return "Invalid Number! Must be 10 digits & start with 6, 7, 8, or 9.";
    }
    return null;
  };

  // 3. Handle Step 1 (Basic Info)
  const handleNextStep = () => {
    if(!formData.name || !formData.shopName || !formData.city || !formData.phone || !formData.password) {
      setStatus("❌ Please fill in all fields.");
      return;
    }

    const phoneError = validatePhone(formData.phone);
    if (phoneError) {
      setStatus("❌ " + phoneError);
      return;
    }

    setStatus(""); 
    setStep(2); // Go to Services
  };

  // 4. Handle Service Changes
  const handleServiceChange = (i, field, value) => {
    const newS = [...services];
    newS[i][field] = value;
    setServices(newS);
  };

  // 5. Send OTP
  const handleSendOtp = async () => {
    setStatus("⏳ Generating Recaptcha & Sending OTP...");
    
    try {
      const appVerifier = window.recaptchaVerifier;
      const phoneNumber = "+91" + formData.phone; 

      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(confirmation);
      setOtpSent(true);
      setStatus(`✅ OTP sent to ${phoneNumber}`);
    } catch (error) {
      console.error(error);
      setStatus("🔥 SMS Error: " + error.message);
      
      // Reset ReCaptcha if it fails
      if(window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
        // Re-init logic is handled by reload usually, but clearing prevents crash
      }
    }
  };

  // 6. Verify OTP & Create Account
  const handleVerifyAndRegister = async () => {
    if (!otp || otp.length !== 6) {
      setStatus("❌ Enter valid 6-digit OTP.");
      return;
    }
    setStatus("⏳ Verifying & Registering Shop...");

    try {
      const result = await confirmationResult.confirm(otp);
      const user = result.user;

      await setDoc(doc(db, "users", user.uid), {
        type: 'barber',
        ...formData,
        services,
        authMethod: 'phone',
        isOpen: true,
        personalVisitCharge: 0,
        schedule: "9 AM - 9 PM"
      });

      setStatus("✅ Success! Welcome to BarberConnect.");
      setTimeout(() => navigate('/dashboard'), 1500);

    } catch (error) {
      setStatus("❌ Invalid OTP. Try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 mt-8 bg-white shadow-xl rounded-2xl border border-gray-100 relative">
      <Link to="/" className="flex items-center text-gray-500 mb-6 font-bold hover:text-indigo-600"><ArrowLeft size={20}/> Back</Link>
      <h2 className="text-3xl font-bold mb-2 text-indigo-900">Partner Registration</h2>
      <p className="text-gray-500 mb-6">Step {step} of 2: {step === 1 ? "Shop Details" : "Services & Verification"}</p>

      {/* Status Box */}
      {status && (
        <div className={`p-4 mb-6 rounded-lg font-bold text-center ${status.includes("Error") || status.includes("❌") || status.includes("🔥") ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>
          {status}
        </div>
      )}

      {/* STEP 1 */}
      {step === 1 ? (
        <div className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-2 gap-4">
            <input className="w-full p-4 border rounded-xl bg-gray-50" placeholder="Your Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            <input className="w-full p-4 border rounded-xl bg-gray-50" placeholder="Shop Name" value={formData.shopName} onChange={e => setFormData({...formData, shopName: e.target.value})} />
          </div>
          <input className="w-full p-4 border rounded-xl bg-gray-50" placeholder="City" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
          
          <div className="relative">
            <span className="absolute left-4 top-4 text-gray-500 font-bold">+91</span>
            <input 
              className="w-full p-4 pl-14 border rounded-xl bg-gray-50 font-bold tracking-widest" 
              type="tel"
              maxLength="10"
              placeholder="9876543210" 
              value={formData.phone}
              onChange={e => {
                const val = e.target.value.replace(/\D/g, '');
                setFormData({...formData, phone: val});
              }} 
            />
          </div>

          <input className="w-full p-4 border rounded-xl bg-gray-50" type="password" placeholder="Create Password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
          
          <button onClick={handleNextStep} className="w-full bg-indigo-600 text-white p-4 rounded-xl font-bold hover:bg-indigo-700 shadow-lg mt-4 transition">
            Next: Add Services
          </button>
        </div>
      ) : (
        /* STEP 2 */
        <div className="animate-fade-in">
          {!otpSent ? (
            <>
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
                <button onClick={handleSendOtp} className="w-2/3 bg-black text-white p-4 rounded-xl font-bold hover:bg-gray-800 shadow-lg flex items-center justify-center gap-2">
                  <Phone size={18}/> Verify & Register
                </button>
              </div>
            </>
          ) : (
            /* OTP UI */
            <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-200">
              <h3 className="text-xl font-bold mb-2 text-indigo-900">Verify Phone Number</h3>
              <p className="text-gray-600 mb-4">Enter the 6-digit code sent to <b>+91 {formData.phone}</b></p>
              
              <div className="flex gap-2 mb-4">
                <input 
                  className="flex-1 p-4 border border-indigo-300 rounded-xl text-center font-bold text-2xl tracking-[0.5em] bg-white"
                  maxLength="6"
                  placeholder="000000"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  autoFocus
                />
              </div>

              <button onClick={handleVerifyAndRegister} className="w-full bg-green-600 text-white p-4 rounded-xl font-bold hover:bg-green-700 shadow-md flex items-center justify-center gap-2">
                <CheckCircle size={20}/> Confirm & Launch Shop
              </button>
              <button onClick={() => setOtpSent(false)} className="w-full text-center text-gray-500 mt-4 text-sm underline">Wrong Number? Go Back</button>
            </div>
          )}
        </div>
      )}

      {/* CRITICAL: RECAPTCHA CONTAINER MUST BE HERE (OUTSIDE STEPS) */}
      <div id="recaptcha-container"></div>
    </div>
  );
}