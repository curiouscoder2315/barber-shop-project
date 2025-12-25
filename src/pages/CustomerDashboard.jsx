import React, { useState, useEffect } from 'react';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin, Sparkles, User, Clock, Users, Filter, Hourglass } from 'lucide-react';

// --- ENHANCED DEMO DATA ---
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
    address: "Shop 12, Main Market, Andheri West",
    queueLength: 4, // 4 people waiting
    schedule: "10:00 AM - 9:00 PM",
    services: [
      {name: 'Haircut', price: 250, time: 30}, 
      {name: 'Beard Trim', price: 150, time: 15}, 
      {name: 'Head Massage', price: 300, time: 20}
    ],
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
    address: "Opposite City Mall, Link Road",
    queueLength: 2,
    schedule: "9:00 AM - 10:00 PM",
    services: [
      {name: 'Fade Cut', price: 350, time: 40}, 
      {name: 'Facial', price: 800, time: 60}
    ],
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
    address: "Near Railway Station, Dadar East",
    queueLength: 0,
    schedule: "8:00 AM - 8:00 PM",
    services: [
      {name: 'Quick Cut', price: 150, time: 20}, 
      {name: 'Shave', price: 100, time: 15}
    ],
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
    address: "High Street Phoenix, Lower Parel",
    queueLength: 8,
    schedule: "11:00 AM - 7:00 PM",
    services: [
      {name: 'Groom Package', price: 2500, time: 120}, 
      {name: 'Styling', price: 800, time: 45}
    ],
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
    address: "Green Park Society, Juhu",
    queueLength: 3,
    schedule: "10:00 AM - 8:00 PM",
    services: [
      {name: 'Haircut', price: 300, time: 30}, 
      {name: 'Color', price: 1200, time: 90}
    ],
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
    address: "Sector 4, Vashi Navi Mumbai",
    queueLength: 5,
    schedule: "9:00 AM - 9:00 PM",
    services: [
      {name: 'Classic Cut', price: 400, time: 35}, 
      {name: 'Shave', price: 200, time: 20}
    ],
    description: "Old school barber vibe with modern techniques."
  }
];

export default function CustomerDashboard() {
  const [barbers, setBarbers] = useState([]);
  const [filteredBarbers, setFilteredBarbers] = useState([]);
  const [userCity, setUserCity] = useState('Your City');
  const [userName, setUserName] = useState("Customer");
  const [selectedService, setSelectedService] = useState('All');
  const navigate = useNavigate();

  // Helper to calculate wait time (Assume avg 20 mins per person in queue)
  const AVG_TIME_PER_PERSON = 20; 

  useEffect(() => {
    const loadData = async () => {
      if (!auth.currentUser) {
        setBarbers(staticBarbers);
        setFilteredBarbers(staticBarbers);
        return;
      }

      try {
        const userSnap = await getDoc(doc(db, "users", auth.currentUser.uid));
        let myCity = "Mumbai"; 

        if (userSnap.exists()) {
          const data = userSnap.data();
          myCity = data.location?.city || data.city || "Mumbai";
          setUserCity(myCity);
          setUserName(data.name || "Customer");
        }

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
            address: b.address || `${b.city} Market Area`,
            queueLength: Math.floor(Math.random() * 6), // Random queue for demo
            schedule: b.schedule || "10:00 AM - 9:00 PM",
            services: b.services && b.services.length > 0 ? b.services : [{name: 'Consultation', price: 0, time: 15}],
            isReal: true
          };
        });

        const localStaticBarbers = staticBarbers.map(b => ({ ...b, city: myCity }));
        const allBarbers = [...realBarbers, ...localStaticBarbers];
        
        setBarbers(allBarbers);
        setFilteredBarbers(allBarbers);

      } catch (e) {
        console.error("Error loading dashboard:", e);
        setBarbers(staticBarbers);
        setFilteredBarbers(staticBarbers);
      }
    };
    loadData();
  }, []);

  // Filter Logic
  useEffect(() => {
    if (selectedService === 'All') {
      setFilteredBarbers(barbers);
    } else {
      const filtered = barbers.filter(b => 
        b.services.some(s => s.name.toLowerCase().includes(selectedService.toLowerCase()))
      );
      setFilteredBarbers(filtered);
    }
  }, [selectedService, barbers]);

  const uniqueServices = ['All', 'Haircut', 'Beard', 'Shave', 'Massage', 'Facial', 'Color'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors">
      <Sidebar role="customer" />
      
      {/* Hero Section */}
      <div className="bg-indigo-900 text-white py-12 px-6 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-20 -mt-20"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Hello, {userName} 👋</h1>
          <h2 className="text-2xl text-indigo-200">Find the Best Barbers in <span className="text-white font-bold underline decoration-indigo-400">{userCity}</span></h2>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-12">
        
        {/* --- FILTER SECTION --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 animate-fade-in">
          <div className="flex items-center gap-3">
            <Sparkles className="text-indigo-600 dark:text-indigo-400" size={28}/>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Nearby Shops</h2>
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            <Filter size={20} className="text-gray-400 min-w-[20px]"/>
            {uniqueServices.map(service => (
              <button
                key={service}
                onClick={() => setSelectedService(service)}
                className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                  selectedService === service 
                  ? 'bg-indigo-600 text-white shadow-lg scale-105' 
                  : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 border hover:border-indigo-300'
                }`}
              >
                {service}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBarbers.map((b) => {
            const waitTime = b.isOpen ? b.queueLength * AVG_TIME_PER_PERSON : 0;
            const statusColor = b.queueLength > 5 ? 'text-red-500' : b.queueLength > 2 ? 'text-yellow-600' : 'text-green-600';

            return (
              <div 
                key={b.id} 
                className={`bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer group border ${b.isReal ? 'border-indigo-500 ring-2 ring-indigo-100 dark:ring-indigo-900' : 'border-transparent'}`}
                onClick={() => navigate(`/shop/${b.id}`, {state: {shop: b}})}
              >
                <div className="h-48 overflow-hidden relative">
                  <img src={b.image} alt={b.shopName} className="w-full h-full object-cover group-hover:scale-110 transition duration-700"/>
                  
                  {/* Status Badge */}
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold shadow-md ${b.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {b.isOpen ? 'OPEN NOW' : 'CLOSED'}
                  </div>

                  {/* Queue Overlay (New) */}
                  {b.isOpen && (
                    <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-md p-3 rounded-xl flex items-center justify-between text-white border border-white/20">
                      <div className="flex items-center gap-2">
                        <Users size={14} className="text-indigo-400"/>
                        <span className="text-xs font-bold">Queue: {b.queueLength}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Hourglass size={14} className="text-yellow-400"/>
                        <span className="text-xs font-bold">~{waitTime} min wait</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors line-clamp-1">{b.shopName}</h3>
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                       <Star size={14} className="text-yellow-500 fill-yellow-500"/>
                       <span className="font-bold text-sm text-yellow-700">{b.rating}</span>
                    </div>
                  </div>

                  <p className="text-gray-500 text-xs mb-4 flex items-start gap-1">
                    <MapPin size={14} className="text-indigo-500 shrink-0 mt-0.5"/> 
                    {b.address}, {b.city}
                  </p>
                  
                  {/* Service Price Preview */}
                  <div className="border-t border-gray-100 dark:border-slate-700 pt-4 flex justify-between items-center">
                    <div>
                      <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Starting Service</span>
                      <span className="text-lg font-bold text-indigo-700 dark:text-indigo-400">
                        ₹{b.services[0].price} <span className="text-xs text-gray-400 font-normal">({b.services[0].time} min)</span>
                      </span>
                    </div>
                    <button className="bg-gray-900 text-white p-2 rounded-lg hover:bg-indigo-600 transition">
                      <Clock size={18} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}