import React from 'react';
import Navbar from '../components/Navbar';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function Contact() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
          <form className="space-y-4">
            <input placeholder="Your Name" className="w-full p-3 border rounded-lg" />
            <input placeholder="Email Address" className="w-full p-3 border rounded-lg" />
            <textarea placeholder="Message" className="w-full p-3 border rounded-lg h-32"></textarea>
            <button className="w-full bg-black text-white py-3 rounded-lg font-bold">Send Message</button>
          </form>
        </div>
        <div className="space-y-6 flex flex-col justify-center">
          <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
            <div className="bg-indigo-100 p-3 rounded-full"><MapPin className="text-indigo-600"/></div>
            <div><p className="font-bold">Head Office</p><p className="text-gray-500">Tech Park, Sector 5, Mumbai</p></div>
          </div>
          <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
            <div className="bg-green-100 p-3 rounded-full"><Phone className="text-green-600"/></div>
            <div><p className="font-bold">Phone</p><p className="text-gray-500">+91 98765 43210</p></div>
          </div>
          <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
            <div className="bg-red-100 p-3 rounded-full"><Mail className="text-red-600"/></div>
            <div><p className="font-bold">Email</p><p className="text-gray-500">support@barberconnect.com</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}