import React from 'react';
import Sidebar from '../components/Sidebar';
import { Search } from 'lucide-react';

export default function BarberHistory() {
  const history = Array(15).fill(null).map((_, i) => ({
    id: i,
    name: i % 2 === 0 ? "Rahul Gupta" : "Amit Sharma",
    date: `${i + 1} Dec 2023`,
    service: i % 3 === 0 ? "Full Grooming" : "Haircut",
    price: i % 3 === 0 ? 800 : 250,
    rating: 5
  }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Sidebar role="barber" />
      <div className="max-w-6xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold dark:text-white">Customer History</h1>
          <div className="relative">
            <input placeholder="Search Customer..." className="pl-10 pr-4 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18}/>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100 dark:bg-slate-700 border-b dark:border-slate-600">
              <tr>
                <th className="p-4 text-gray-600 dark:text-gray-300 font-bold">Customer</th>
                <th className="p-4 text-gray-600 dark:text-gray-300 font-bold">Date</th>
                <th className="p-4 text-gray-600 dark:text-gray-300 font-bold">Service</th>
                <th className="p-4 text-gray-600 dark:text-gray-300 font-bold">Amount</th>
                <th className="p-4 text-gray-600 dark:text-gray-300 font-bold">Rating</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item.id} className="border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition">
                  <td className="p-4 font-bold dark:text-white">{item.name}</td>
                  <td className="p-4 text-gray-500 dark:text-gray-400">{item.date}</td>
                  <td className="p-4 text-indigo-600 dark:text-indigo-400 font-medium">{item.service}</td>
                  <td className="p-4 font-bold text-green-600">₹{item.price}</td>
                  <td className="p-4 text-yellow-500">{'★'.repeat(item.rating)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}