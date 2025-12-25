import React from 'react';
import Navbar from '../components/Navbar';

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-4xl mx-auto p-8 text-center">
        <h1 className="text-4xl font-bold text-indigo-900 mb-6">Redefining Grooming</h1>
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          BarberConnect started with a simple idea: Why wait in line? 
          We connect the best local talent with customers who value their time.
          Whether you need a quick trim or a full spa experience at home, we are here.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="p-6 bg-gray-50 rounded-xl">
            <h3 className="text-2xl font-bold text-indigo-600">10k+</h3>
            <p>Happy Customers</p>
          </div>
          <div className="p-6 bg-gray-50 rounded-xl">
            <h3 className="text-2xl font-bold text-indigo-600">500+</h3>
            <p>Verified Barbers</p>
          </div>
          <div className="p-6 bg-gray-50 rounded-xl">
            <h3 className="text-2xl font-bold text-indigo-600">50+</h3>
            <p>Cities</p>
          </div>
        </div>
      </div>
    </div>
  );
}