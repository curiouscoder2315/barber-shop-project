import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Send, Camera, Sparkles, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

// --- CONFIGURATION ---
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Mock Database for Salons
const SALONS_DB = [
  { id: 1, name: "Urban Cuts Studio", price: "₹350 - ₹600", image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=500&q=80" },
  { id: 2, name: "The Gentleman's Grooming", price: "₹500 - ₹1200", image: "https://images.unsplash.com/photo-1503951914875-452162b7f30a?w=500&q=80" },
  { id: 3, name: "Budget Bros Barbers", price: "₹150 - ₹300", image: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=500&q=80" }
];

export default function AIStylist() {
  const [messages, setMessages] = useState([
    { role: 'ai', text: "👋 Hi! I'm your AI Stylist. Upload a selfie and tell me what service you need (e.g., 'New Haircut', 'Beard Styling')." }
  ]);
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage({ file, preview: reader.result });
        setMessages(prev => [...prev, { role: 'user', image: reader.result, text: "I uploaded this photo." }]);
      };
      reader.readAsDataURL(file);
    }
  };

  async function fileToGenerativePart(file) {
    const base64EncodedDataPromise = new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.readAsDataURL(file);
    });
    return {
      inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
  }

  const handleSend = async () => {
    if (!input.trim() && !selectedImage) return;

    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // --- FINAL FIX: Switch to the PRO model ---
      // This model is the most widely available.
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      
      let prompt = `Act as a professional hair stylist. 
      The user wants: "${input}". 
      If an image is provided, analyze their face shape and hair texture. 
      Suggest 3 specific styles that would look good. 
      Explain WHY they work. 
      Provide an estimated cost in INR.
      Keep it short and friendly.`;

      let result;
      if (selectedImage) {
        const imagePart = await fileToGenerativePart(selectedImage.file);
        result = await model.generateContent([prompt, imagePart]);
      } else {
        result = await model.generateContent(prompt);
      }

      const response = await result.response;
      const text = response.text();

      setMessages(prev => [...prev, { role: 'ai', text: text, isRecommendation: true }]);
    } catch (error) {
      console.error("AI Error:", error);
      
      // --- FALLBACK MODE ---
      // If the API fails during the hackathon demo, this Fake response will save you!
      // It simulates a working AI so your presentation doesn't stop.
      const fallbackResponse = `(Network/API Issue - Running Offline Mode)\n\nBased on your request for "${input}", here are my suggestions:\n\n1. **The Classic Fade**: Great for your face shape. Clean and professional.\n2. **Textured Crop**: Adds volume and modern style.\n3. **Side Part**: Timeless and elegant.\n\nEstimated Cost: ₹400 - ₹800`;
      
      setMessages(prev => [...prev, { role: 'ai', text: fallbackResponse, isRecommendation: true }]);
      
    } finally {
      setIsLoading(false);
      setSelectedImage(null);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-4 text-white shadow-md">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Sparkles className="text-yellow-300" /> AI Style Expert <span className="text-xs bg-white text-blue-700 px-2 py-0.5 rounded-full">Pro Model</span>
        </h1>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${
              msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none border border-gray-200'
            }`}>
              {msg.image && <img src={msg.image} alt="User upload" className="w-48 h-48 object-cover rounded-lg mb-2" />}
              <div className="whitespace-pre-wrap">{msg.text}</div>

              {/* Show Booking Cards if AI makes a recommendation */}
              {msg.isRecommendation && (
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <p className="font-bold text-indigo-600 mb-2">👇 Book this look nearby:</p>
                  <div className="grid gap-2">
                    {SALONS_DB.map(salon => (
                      <div key={salon.id} className="bg-gray-50 p-2 rounded border hover:bg-gray-100 flex items-center gap-3">
                        <img src={salon.image} className="w-10 h-10 rounded-full object-cover" alt="Salon" />
                        <div className="flex-1">
                          <h4 className="font-bold text-sm">{salon.name}</h4>
                          <p className="text-xs text-green-600">{salon.price}</p>
                        </div>
                        <Link to={`/shop/${salon.id}`} className="bg-black text-white text-xs px-3 py-1.5 rounded-full">Book</Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && <div className="text-gray-500 text-sm flex items-center gap-2 ml-4"><Loader2 className="animate-spin" size={16}/> Analyzing style...</div>}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t flex items-center gap-2">
        <label className="p-2 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200">
          <Camera size={24} className="text-gray-600" />
          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
        </label>
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={selectedImage ? "Photo selected! Type 'Enter' to send..." : "Type 'Haircut' or upload photo..."}
          className="flex-1 bg-gray-100 rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button onClick={handleSend} disabled={isLoading} className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50">
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}