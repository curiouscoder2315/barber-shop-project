import React, { useState } from 'react';

const Chatbot = ({ onBook }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: "Hi! Looking for a barber? I can help you book an appointment." }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    // 1. Add User Message
    const userMsg = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // 2. Mock AI Response (Replace with real backend later)
    setTimeout(() => {
      const botResponse = {
        sender: 'bot',
        text: "I found a great match: 'Fade & Beard Trim' at Mike's Shop.",
        // The data object triggers the button
        data: {
          action: 'book',
          shopId: 'shop_123', // This ID should match a real ID in your DB
          serviceName: 'Fade & Beard Trim'
        }
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {isOpen && (
        <div className="bg-white dark:bg-slate-800 w-80 h-96 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden mb-4">
          <div className="bg-blue-600 text-white p-3 flex justify-between items-center">
            <span className="font-semibold">Barber Assistant</span>
            <button onClick={() => setIsOpen(false)} className="text-xl">&times;</button>
          </div>
          <div className="flex-1 p-3 overflow-y-auto bg-gray-50 dark:bg-slate-900">
            {messages.map((msg, index) => (
              <div key={index} className={`mb-2 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-2 rounded-lg text-sm ${
                  msg.sender === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-gray-200'
                }`}>
                  <p>{msg.text}</p>
                  {/* BOOK BUTTON */}
                  {msg.data && msg.data.action === 'book' && (
                    <button 
                      onClick={() => onBook(msg.data.shopId)}
                      className="mt-2 w-full bg-green-500 text-white text-xs font-bold py-1 px-2 rounded hover:bg-green-600 transition"
                    >
                      Book at Shop
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="p-2 border-t dark:border-gray-700 flex gap-2 bg-white dark:bg-slate-800">
            <input 
              className="flex-1 border dark:border-gray-600 rounded px-2 py-1 text-sm dark:bg-slate-700 dark:text-white"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type..."
            />
            <button onClick={handleSend} className="bg-blue-600 text-white px-3 rounded text-sm">Send</button>
          </div>
        </div>
      )}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:scale-105 transition-transform"
        >
          💬
        </button>
      )}
    </div>
  );
};

export default Chatbot;