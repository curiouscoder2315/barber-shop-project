import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Star, MapPin, Phone, Mail, ArrowRight, Instagram, Twitter, Facebook } from 'lucide-react';

export default function Home() {
  return (
    <div className="font-sans">
      <Navbar />

      {/* 1. HERO SECTION */}
      <div className="relative h-[600px] flex items-center justify-center text-center text-white">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074&auto=format&fit=crop')" }}
        >
          <div className="absolute inset-0 bg-black opacity-60"></div>
        </div>

        <div className="relative z-10 max-w-4xl px-6">
          <div className="inline-block bg-indigo-600 px-4 py-1 rounded-full text-sm font-bold mb-4">#1 Grooming App in India</div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            Style at Your <span className="text-indigo-400">Doorstep</span>.
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto">
            Book top-rated barbers for home visits or shop appointments. No queues, just style.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link to="/register-customer" className="bg-white text-black px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition shadow-lg flex items-center justify-center">
              Book a Cut <ArrowRight className="ml-2" />
            </Link>
            <Link to="/register-barber" className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-black transition flex items-center justify-center">
              Register Shop
            </Link>
          </div>
        </div>
      </div>

      {/* 2. STATS */}
      <div className="bg-indigo-900 text-white py-10">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div><h3 className="text-3xl font-bold">12k+</h3><p className="text-indigo-300">Cuts Delivered</p></div>
          <div><h3 className="text-3xl font-bold">4.8/5</h3><p className="text-indigo-300">Average Rating</p></div>
          <div><h3 className="text-3xl font-bold">500+</h3><p className="text-indigo-300">Expert Barbers</p></div>
          <div><h3 className="text-3xl font-bold">24/7</h3><p className="text-indigo-300">Booking Available</p></div>
        </div>
      </div>

      {/* 3. TESTIMONIALS */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">What People Are Saying</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition">
                <div className="flex text-yellow-400 mb-4"><Star fill="currentColor"/><Star fill="currentColor"/><Star fill="currentColor"/><Star fill="currentColor"/><Star fill="currentColor"/></div>
                <p className="text-gray-600 mb-6">"Absolutely amazing service! The barber arrived on time, was super professional, and the haircut was better than a salon."</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  <div>
                    <p className="font-bold">Rahul Sharma</p>
                    <p className="text-xs text-gray-500">Mumbai Customer</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. FOOTER */}
      <footer className="bg-gray-900 text-gray-300 py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <h3 className="text-white text-2xl font-bold mb-4">BarberConnect</h3>
            <p className="text-sm leading-relaxed mb-6">
              The smartest way to look good. We bridge the gap between style and convenience for the modern Indian.
            </p>
            <div className="flex gap-4">
              <Instagram className="hover:text-pink-500 cursor-pointer"/>
              <Twitter className="hover:text-blue-400 cursor-pointer"/>
              <Facebook className="hover:text-blue-600 cursor-pointer"/>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-white">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white">Careers</Link></li>
              <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/contact" className="hover:text-white">Terms of Service</Link></li> {/* <--- THIS WAS THE BROKEN LINE */}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li>Home Haircuts</li>
              <li>Beard Grooming</li>
              <li>Massage Therapy</li>
              <li>Bridal/Groom Packages</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3"><MapPin size={16}/> 123 Innovation Tower, Bangalore</li>
              <li className="flex items-center gap-3"><Phone size={16}/> +91 999-888-7777</li>
              <li className="flex items-center gap-3"><Mail size={16}/> hello@barberconnect.in</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
          &copy; 2025 BarberConnect Technologies Pvt Ltd. All rights reserved.
        </div>
      </footer>
    </div>
  );
}