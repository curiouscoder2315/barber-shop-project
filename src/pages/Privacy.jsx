import React from 'react';
import Navbar from '../components/Navbar';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-3xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-gray-600 mb-4">Last updated: December 2025</p>
        <div className="space-y-4 text-gray-700">
          <p>1. <strong>Data Collection:</strong> We collect basic profile data to connect barbers with customers.</p>
          <p>2. <strong>Location:</strong> Your location is used solely to find nearby services.</p>
          <p>3. <strong>Payments:</strong> We do not store credit card details directly.</p>
          <p>4. <strong>Security:</strong> All data is encrypted using Firebase standards.</p>
        </div>
      </div>
    </div>
  );
}