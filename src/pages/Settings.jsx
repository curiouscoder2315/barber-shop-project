import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import { auth, db, storage } from '../firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { onAuthStateChanged, updatePassword } from 'firebase/auth';
import { User, Mail, Phone, MapPin, Save, Store, Clock, IndianRupee, Lock, ShieldCheck, Camera, Loader, Scissors, Plus, Trash2, Edit2 } from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [role, setRole] = useState('customer');
  const fileInputRef = useRef(null);
  
  // PROFILE STATE
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', city: '', photoURL: '',
    shopName: '', schedule: '', personalVisitCharge: ''
  });

  // SERVICES STATE (Barber Only)
  const [services, setServices] = useState([]);

  // PASSWORD STATE
  const [passData, setPassData] = useState({ newPassword: '', confirmPassword: '' });

  // 1. FETCH DATA
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const snap = await getDoc(doc(db, "users", user.uid));
          if (snap.exists()) {
            const data = snap.data();
            setRole(data.type);
            setFormData({
              name: data.name || '',
              email: data.email || user.email || '',
              phone: data.phone || '',
              city: data.location?.city || data.city || '',
              photoURL: data.photoURL || '',
              shopName: data.shopName || '',
              schedule: data.schedule || '',
              personalVisitCharge: data.personalVisitCharge || ''
            });
            // Load Services if Barber
            if (data.services) setServices(data.services);
          }
        } catch (e) { console.error(e); }
        setLoading(false);
      }
    });
    return unsub;
  }, []);

  // 2. HANDLERS
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handlePassChange = (e) => setPassData({ ...passData, [e.target.name]: e.target.value });

  // --- SERVICE HANDLERS ---
  const handleServiceChange = (index, field, value) => {
    const updated = [...services];
    updated[index][field] = value;
    setServices(updated);
  };
  const addService = () => setServices([...services, { name: '', price: '' }]);
  const removeService = (index) => setServices(services.filter((_, i) => i !== index));
  
  const handleSaveServices = async () => {
    // Filter out empty rows
    const validServices = services.filter(s => s.name.trim() !== '' && s.price !== '');
    
    try {
      await updateDoc(doc(db, "users", auth.currentUser.uid), { services: validServices });
      setServices(validServices); // Update local state to clean version
      alert("✅ Services Menu Updated!");
    } catch (e) { alert("Error: " + e.message); }
  };
  // ------------------------

  // --- PHOTO UPLOAD ---
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !auth.currentUser) return;
    if (!file.type.startsWith('image/')) return alert('Please select an image file.');
    if (file.size > 2 * 1024 * 1024) return alert('File size is too big. Max 2MB allowed.');

    setPhotoLoading(true);
    try {
      const fileRef = ref(storage, `profile_photos/${auth.currentUser.uid}_${Date.now()}`);
      await uploadBytes(fileRef, file);
      const photoURL = await getDownloadURL(fileRef);
      await updateDoc(doc(db, "users", auth.currentUser.uid), { photoURL });
      setFormData(prev => ({ ...prev, photoURL }));
      alert("✅ Photo updated!");
    } catch (error) { alert("Upload failed: " + error.message); }
    setPhotoLoading(false);
  };

  // --- SAVE PROFILE ---
  const handleSaveProfile = async () => {
    if (!auth.currentUser) return;
    if (formData.email) {
      const validDomains = ["@gmail.com", "@outlook.com", "@hotmail.com", "@yahoo.com", "@icloud.com"];
      if (!validDomains.some(d => formData.email.toLowerCase().endsWith(d))) return alert("⚠️ Invalid Email Provider.");
    }
    try {
      const updates = {
        name: formData.name, phone: formData.phone, email: formData.email,
        city: formData.city, location: { city: formData.city },
      };
      if (role === 'barber') {
        updates.shopName = formData.shopName;
        updates.schedule = formData.schedule;
        updates.personalVisitCharge = Number(formData.personalVisitCharge);
      }
      await updateDoc(doc(db, "users", auth.currentUser.uid), updates);
      alert("✅ Profile Updated!");
    } catch (e) { alert("Error: " + e.message); }
  };

  // --- SAVE PASSWORD ---
  const handleSavePassword = async () => {
    const { newPassword, confirmPassword } = passData;
    if (!newPassword || !confirmPassword) return alert("Fill all fields.");
    if (newPassword !== confirmPassword) return alert("Passwords do not match.");
    if (newPassword.length < 6) return alert("Min 6 characters required.");
    try {
      await updatePassword(auth.currentUser, newPassword);
      alert("✅ Password Changed!");
      setPassData({ newPassword: '', confirmPassword: '' });
    } catch (e) {
      e.code === 'auth/requires-recent-login' ? alert("⚠️ Security: Please Logout & Login again.") : alert("Error: " + e.message);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center dark:bg-slate-900 dark:text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors pb-10">
      <Sidebar role={role} />
      
      <div className="max-w-5xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8 dark:text-white">Settings</h1>

        <div className="flex gap-8 flex-col lg:flex-row">
          {/* SIDEBAR TABS */}
          <div className="w-full lg:w-64 flex flex-col gap-2">
            <button onClick={() => setActiveTab('profile')} className={`p-4 text-left rounded-xl font-bold transition flex items-center gap-3 ${activeTab === 'profile' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'}`}>
              <User size={18}/> Profile Details
            </button>
            
            {/* Show Services Tab only for Barbers */}
            {role === 'barber' && (
              <button onClick={() => setActiveTab('services')} className={`p-4 text-left rounded-xl font-bold transition flex items-center gap-3 ${activeTab === 'services' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'}`}>
                <Scissors size={18}/> Manage Services
              </button>
            )}
            
            <button onClick={() => setActiveTab('security')} className={`p-4 text-left rounded-xl font-bold transition flex items-center gap-3 ${activeTab === 'security' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'}`}>
              <ShieldCheck size={18}/> Security
            </button>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="flex-1 bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 min-h-[500px]">
            
            {/* 1. PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-xl font-bold mb-4 dark:text-white">Edit Profile</h2>
                {/* Photo Upload */}
                <div className="flex items-center gap-6 mb-6">
                  <div onClick={() => fileInputRef.current.click()} className="relative w-24 h-24 rounded-full cursor-pointer group overflow-hidden border-2 border-indigo-200 dark:border-slate-600">
                    {photoLoading ? <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-slate-700"><Loader className="animate-spin text-indigo-600" size={24}/></div> : 
                      formData.photoURL ? <img src={formData.photoURL} className="w-full h-full object-cover" /> : 
                      <div className="w-full h-full bg-indigo-100 dark:bg-slate-700 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-3xl">{formData.name ? formData.name.charAt(0).toUpperCase() : 'U'}</div>
                    }
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center"><Camera className="text-white opacity-0 group-hover:opacity-100" size={24}/></div>
                  </div>
                  <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                  <div><h3 className="font-bold text-lg dark:text-white">{role === 'barber' ? 'Shop Owner' : 'Customer'}</h3><p className="text-sm text-gray-500 cursor-pointer hover:text-indigo-600" onClick={() => fileInputRef.current.click()}>Tap photo to change</p></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">Full Name</label><input name="name" value={formData.name} onChange={handleChange} className="w-full p-3 rounded-xl border dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white font-medium outline-none focus:ring-2 focus:ring-indigo-500" /></div>
                  <div><label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">Phone</label><input name="phone" value={formData.phone} onChange={handleChange} className="w-full p-3 rounded-xl border dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white font-medium outline-none focus:ring-2 focus:ring-indigo-500" /></div>
                  <div><label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">City</label><input name="city" value={formData.city} onChange={handleChange} className="w-full p-3 rounded-xl border dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white font-medium outline-none focus:ring-2 focus:ring-indigo-500" /></div>
                  <div><label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">Email</label><input name="email" value={formData.email} onChange={handleChange} className="w-full p-3 rounded-xl border dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white font-medium outline-none focus:ring-2 focus:ring-indigo-500" /></div>

                  {role === 'barber' && (
                    <>
                      <div className="md:col-span-2 border-t dark:border-slate-700 my-2"></div>
                      <div><label className="block text-sm font-bold text-indigo-600 dark:text-indigo-400 mb-2">Shop Name</label><input name="shopName" value={formData.shopName} onChange={handleChange} className="w-full p-3 rounded-xl border border-indigo-200 dark:border-slate-600 bg-indigo-50 dark:bg-slate-700 dark:text-white font-medium outline-none focus:ring-2 focus:ring-indigo-500" /></div>
                      <div><label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">Visit Charge (₹)</label><input type="number" name="personalVisitCharge" value={formData.personalVisitCharge} onChange={handleChange} className="w-full p-3 rounded-xl border dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white font-medium" /></div>
                      <div className="md:col-span-2"><label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">Schedule</label><input name="schedule" value={formData.schedule} onChange={handleChange} className="w-full p-3 rounded-xl border dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white font-medium" /></div>
                    </>
                  )}
                </div>
                <div className="pt-6"><button onClick={handleSaveProfile} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg flex items-center gap-2 hover:scale-105 transition"><Save size={18}/> Save Profile</button></div>
              </div>
            )}

            {/* 2. SERVICES TAB (NEW & BEAUTIFUL) */}
            {activeTab === 'services' && role === 'barber' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold dark:text-white flex items-center gap-2"><Scissors className="text-indigo-500"/> Service Menu</h2>
                  <button onClick={addService} className="bg-black dark:bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:opacity-80 transition"><Plus size={16}/> Add New</button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {services.length === 0 && (
                    <div className="text-center py-10 text-gray-400 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-xl">
                      <p>No services added yet. Click "Add New" to start.</p>
                    </div>
                  )}

                  {services.map((service, index) => (
                    <div key={index} className="flex gap-4 items-center bg-gray-50 dark:bg-slate-700/50 p-4 rounded-xl border border-gray-100 dark:border-slate-600 hover:shadow-md transition duration-300 group">
                      <div className="bg-white dark:bg-slate-800 p-3 rounded-lg text-indigo-600 dark:text-indigo-400 shadow-sm">
                        <Scissors size={20}/>
                      </div>
                      
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Service Name</label>
                          <input 
                            placeholder="e.g. Haircut" 
                            value={service.name} 
                            onChange={(e) => handleServiceChange(index, 'name', e.target.value)}
                            className="w-full bg-transparent font-bold text-gray-800 dark:text-white border-b border-transparent focus:border-indigo-500 outline-none pb-1 placeholder-gray-300 transition-colors"
                          />
                        </div>
                        <div className="relative">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Price (₹)</label>
                          <div className="relative">
                            <IndianRupee size={14} className="absolute left-0 top-1 text-gray-400"/>
                            <input 
                              type="number" 
                              placeholder="000" 
                              value={service.price} 
                              onChange={(e) => handleServiceChange(index, 'price', e.target.value)}
                              className="w-full pl-5 bg-transparent font-bold text-indigo-600 dark:text-indigo-400 border-b border-transparent focus:border-indigo-500 outline-none pb-1 placeholder-gray-300"
                            />
                          </div>
                        </div>
                      </div>

                      <button onClick={() => removeService(index)} className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Delete Service">
                        <Trash2 size={18}/>
                      </button>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t dark:border-slate-700 flex justify-end">
                  <button onClick={handleSaveServices} className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 shadow-lg flex items-center gap-2 hover:scale-105 transition">
                    <Save size={18}/> Save Menu Changes
                  </button>
                </div>
              </div>
            )}

            {/* 3. SECURITY TAB */}
            {activeTab === 'security' && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-xl font-bold mb-4 dark:text-white flex items-center gap-2"><ShieldCheck className="text-green-600"/> Security Settings</h2>
                <div className="p-4 bg-indigo-50 dark:bg-slate-700/50 rounded-xl border border-indigo-100 dark:border-slate-600 mb-6"><p className="text-sm text-indigo-800 dark:text-indigo-300 font-medium">Create a strong password to keep your account safe.</p></div>
                <div className="max-w-md space-y-4">
                  <div><label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">New Password</label><div className="relative"><Lock className="absolute left-4 top-3.5 text-gray-400" size={18}/><input type="password" name="newPassword" placeholder="••••••••" value={passData.newPassword} onChange={handlePassChange} className="w-full pl-12 p-3 rounded-xl border dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white font-medium outline-none focus:ring-2 focus:ring-indigo-500" /></div></div>
                  <div><label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">Confirm New Password</label><div className="relative"><Lock className="absolute left-4 top-3.5 text-gray-400" size={18}/><input type="password" name="confirmPassword" placeholder="••••••••" value={passData.confirmPassword} onChange={handlePassChange} className="w-full pl-12 p-3 rounded-xl border dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white font-medium outline-none focus:ring-2 focus:ring-indigo-500" /></div></div>
                </div>
                <div className="pt-6"><button onClick={handleSavePassword} className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 shadow-lg flex items-center gap-2 hover:scale-105 transition"><ShieldCheck size={18}/> Update Password</button></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}