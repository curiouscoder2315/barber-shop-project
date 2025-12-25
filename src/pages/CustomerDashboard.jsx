import React, { useState, useEffect } from 'react';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin, Sparkles, User, Clock } from 'lucide-react';

// --- DEMO DATA ---
const staticBarbers = [
  {
    id: 'demo-1',
    name: 'Rajesh Verma',
    shopName: 'The Royal Cuts',
    image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviews: 124,
    isOpen: true,
    personalVisitCharge: 200,
    schedule: "10:00 AM - 9:00 PM",
    services: [{name: 'Haircut', price: 250}, {name: 'Beard Trim', price: 150}, {name: 'Head Massage', price: 300}],
    description: "Premium grooming experience with 10+ years of experience. AC salon with free WiFi."
  },
  {
    id: 'demo-2',
    name: 'Sameer Khan',
    shopName: 'Urban Touch Salon',
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80',
    rating: 4.5,
    reviews: 89,
    isOpen: true,
    personalVisitCharge: 300,
    schedule: "9:00 AM - 10:00 PM",
    services: [{name: 'Fade Cut', price: 350}, {name: 'Facial', price: 800}],
    description: "Modern styling for the modern man. Specialists in fades and beard styling."
  },
  {
    id: 'demo-3',
    name: 'Vikram Singh',
    shopName: 'Scissors & Spice',
    image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80',
    rating: 4.2,
    reviews: 45,
    isOpen: false,
    personalVisitCharge: 150,
    schedule: "8:00 AM - 8:00 PM",
    services: [{name: 'Quick Cut', price: 150}, {name: 'Shave', price: 100}],
    description: "Budget friendly and quick service. Best for daily grooming."
  },
  {
    id: 'demo-4',
    name: 'Arjun Das',
    shopName: 'Golden Scissors',
    image: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviews: 210,
    isOpen: true,
    personalVisitCharge: 500,
    schedule: "11:00 AM - 7:00 PM",
    services: [{name: 'Groom Package', price: 2500}, {name: 'Styling', price: 800}],
    description: "Luxury salon visited by celebrities. Appointment only."
  },
  {
    id: 'demo-5',
    name: 'Amit Patel',
    shopName: 'Looks Unisex Salon',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
    rating: 4.3,
    reviews: 67,
    isOpen: true,
    personalVisitCharge: 250,
    schedule: "10:00 AM - 8:00 PM",
    services: [{name: 'Haircut', price: 300}, {name: 'Color', price: 1200}],
    description: "Complete family salon with separate sections for men and women."
  },
  {
    id: 'demo-6',
    name: 'John D',
    shopName: 'Barber Bros',
    image: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    reviews: 92,
    isOpen: true,
    personalVisitCharge: 200,
    schedule: "9:00 AM - 9:00 PM",
    services: [{name: 'Classic Cut', price: 400}, {name: 'Shave', price: 200}],
    description: "Old school barber vibe with modern techniques."
  },
  {
    id: 'demo-7',
    name: 'Rahul Mehra',
    shopName: 'Grooming Hub',
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80',
    rating: 4.1,
    reviews: 34,
    isOpen: true,
    personalVisitCharge: 150,
    schedule: "10:00 AM - 7:00 PM",
    services: [{name: 'Haircut', price: 150}, {name: 'Massage', price: 200}],
    description: "Affordable and hygienic services."
  },
  {
    id: 'demo-8',
    name: 'Suresh Kumar',
    shopName: 'The Man Cave',
    image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviews: 156,
    isOpen: true,
    personalVisitCharge: 350,
    schedule: "8:00 AM - 10:00 PM",
    services: [{name: 'Premium Cut', price: 500}, {name: 'Spa', price: 1500}],
    description: "Relax, unwind and get styled."
  },
  {
    id: 'demo-9',
    name: 'David',
    shopName: 'Sharp Edges',
    image: 'https://images.unsplash.com/photo-1532710093739-9470acff878f?auto=format&fit=crop&w=800&q=80',
    rating: 4.4,
    reviews: 78,
    isOpen: false,
    personalVisitCharge: 200,
    schedule: "10:00 AM - 8:00 PM",
    services: [{name: 'Haircut', price: 250}, {name: 'Beard', price: 150}],
    description: "Precision cutting specialist."
  }
];

export default function CustomerDashboard() {
  const [barbers, setBarbers] = useState([]);
  const [userCity, setUserCity] = useState('Your City');
  const [userName, setUserName] = useState("Customer");
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      if (!auth.currentUser) {
        setBarbers(staticBarbers);
        return;
      }

      try {
        // 1. Get Current User's Location
        const userSnap = await getDoc(doc(db, "users", auth.currentUser.uid));
        let myCity = "Mumbai"; 

        if (userSnap.exists()) {
          const data = userSnap.data();
          myCity = data.location?.city || data.city || "Mumbai";
          setUserCity(myCity);
          setUserName(data.name || "Customer");
        }

        // 2. FETCH REAL BARBERS
        const barbersQuery = query(
          collection(db, "users"), 
          where("type", "==", "barber"),
          where("city", "==", myCity)
        );
        
        const querySnapshot = await getDocs(barbersQuery);
        
        const realBarbers = querySnapshot.docs.map(doc => {
          const b = doc.data();
          return {
            id: doc.id,
            name: b.name,
            shopName: b.shopName || b.name + "'s Shop",
            image: b.photoURL || 'https://images.unsplash.com/photo-1599351431202-6e0c051dd26b?auto=format&fit=crop&w=800&q=80', 
            rating: 5.0, 
            reviews: 0,
            isOpen: b.isOpen !== undefined ? b.isOpen : true,
            personalVisitCharge: b.personalVisitCharge || 0,
            city: b.city,
            // --- FIX: Now fetching real schedule ---
            schedule: b.schedule || "10:00 AM - 9:00 PM",
            services: b.services && b.services.length > 0 ? b.services : [{name: 'Consultation', price: 0}],
            isReal: true
          };
        });

        // 3. Prepare Demo Barbers
        const localStaticBarbers = staticBarbers.map(b => ({ ...b, city: myCity }));

        setBarbers([...realBarbers, ...localStaticBarbers]);

      } catch (e) {
        console.error("Error loading dashboard:", e);
        setBarbers(staticBarbers);
      }
    };
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors">
      <Sidebar role="customer" />
      
      {/* Hero Section */}
      <div className="bg-indigo-900 text-white py-12 px-6 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-5 rounded-full -ml-10 -mb-10"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Hello, {userName} 👋</h1>
          <h2 className="text-2xl text-indigo-200">Find the Best Barbers in <span className="text-white font-bold underline decoration-indigo-400">{userCity}</span></h2>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-12">
        
        <div className="flex items-center gap-3 mb-8 animate-fade-in">
          <Sparkles className="text-indigo-600 dark:text-indigo-400" size={28}/>
          <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-600 dark:from-indigo-400 dark:to-purple-400 pb-2">
            Top Recommendations For You
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {barbers.map((b) => (
            <div 
              key={b.id} 
              className={`bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer group border ${b.isReal ? 'border-indigo-500 ring-2 ring-indigo-100 dark:ring-indigo-900' : 'border-transparent'} hover:border-indigo-200 dark:hover:border-slate-600`}
              onClick={() => navigate(`/shop/${b.id}`, {state: {shop: b}})}
            >
              <div className="h-56 overflow-hidden relative">
                <img 
                  src={b.image} 
                  alt={b.shopName} 
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1503951914875-befbb7470d03?auto=format&fit=crop&w=800&q=80"; }} 
                />
                {!b.isOpen && (
                  <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-[2px] flex items-center justify-center">
                    <span className="text-white font-bold border-2 border-white px-4 py-2 rounded-lg tracking-widest uppercase">Currently Closed</span>
                  </div>
                )}
                
                {b.isReal && (
                  <div className="absolute top-4 left-4 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                    <User size={12}/> Verified
                  </div>
                )}

                <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black/80 to-transparent"></div>
              </div>
              
              <div className="p-6 relative">
                <div className="absolute -top-5 right-6 bg-white dark:bg-slate-700 shadow-lg px-3 py-1 rounded-full flex items-center gap-1 font-bold text-sm border border-gray-100 dark:border-slate-600">
                   <Star size={14} className="text-yellow-500 fill-yellow-500"/>
                   <span className="dark:text-white">{b.rating}</span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{b.shopName}</h3>
                
                {/* --- LOCATION --- */}
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-2 flex items-center">
                  <MapPin size={14} className="mr-1 text-indigo-500"/> {b.city}
                </p>

                {/* --- TIMING (NEW) --- */}
                <p className="text-gray-400 dark:text-gray-500 text-xs font-bold mb-4 flex items-center">
                  <Clock size={12} className="mr-1"/> {b.schedule}
                </p>
                
                <div className="border-t dark:border-slate-700 pt-4 flex justify-between items-center">
                  <div>
                    <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Starts From</span>
                    <span className="text-lg font-bold text-indigo-700 dark:text-indigo-400">
                      ₹{b.services && b.services.length > 0 ? b.services[0].price : '0'}
                    </span>
                  </div>
                  <button className="bg-gray-100 dark:bg-slate-700 hover:bg-indigo-600 hover:text-white text-indigo-900 dark:text-indigo-200 px-4 py-2 rounded-lg font-bold text-sm transition-colors">
                    View Shop
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}