import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase/config';
import { ThemeProvider } from './context/ThemeContext';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import BarberRegister from './pages/BarberRegister';
import CustomerRegister from './pages/CustomerRegister';
import CustomerSetup from './pages/CustomerSetup';
import BarberDashboard from './pages/BarberDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import BarberAnalytics from './pages/BarberAnalytics';
import ShopDetails from './pages/ShopDetails';
import Settings from './pages/Settings';
import History from './pages/History';
import BookingQueue from './pages/BookingQueue';
import BarberHistory from './pages/BarberHistory';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import AIStylist from './pages/AIStylist';

// Components
import Chatbot from './components/Chatbot'; // Ensure this path is correct

// --- INTERNAL COMPONENT FOR ROUTING LOGIC ---
// We need this inner component so we can use 'useLocation' and 'useNavigate'
// which only work INSIDE <BrowserRouter>
const AppContent = ({ user, role }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Logic: Show Chatbot ONLY if user is logged in AND not on the landing page
  const isLandingPage = location.pathname === '/';
  const showChatbot = user && !isLandingPage;

  // The function to run when "Book" is clicked in Chat
  const handleBookingFromChat = (shopId) => {
    // Navigates to your existing Shop Details page
    navigate(`/shop/${shopId}`);
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/ai-stylist" element={<AIStylist />} />

        {/* Login/Register */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register-barber" element={!user ? <BarberRegister /> : <Navigate to="/dashboard" />} />
        <Route path="/register-customer" element={!user ? <CustomerRegister /> : <Navigate to="/dashboard" />} />

        {/* Protected Routes */}
        <Route path="/customer-setup" element={user ? <CustomerSetup /> : <Navigate to="/login" />} />
        
        <Route path="/dashboard" element={
          user ? (role === 'barber' ? <BarberDashboard /> : <CustomerDashboard />) : <Navigate to="/login" />
        } />
        
        <Route path="/analytics" element={user ? <BarberAnalytics /> : <Navigate to="/login" />} />
        <Route path="/queue" element={user ? <BookingQueue /> : <Navigate to="/login" />} />
        <Route path="/barber-history" element={user ? <BarberHistory /> : <Navigate to="/login" />} />
        <Route path="/shop/:id" element={user ? <ShopDetails /> : <Navigate to="/login" />} />
        <Route path="/settings" element={user ? <Settings /> : <Navigate to="/login" />} />
        <Route path="/history" element={user ? <History /> : <Navigate to="/login" />} />
      </Routes>

      {/* RENDER CHATBOT CONDITIONALLY */}
      {showChatbot && (
        <Chatbot onBook={handleBookingFromChat} />
      )}
    </>
  );
};

// --- MAIN APP COMPONENT ---
export default function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        const snap = await getDoc(doc(db, "users", u.uid));
        if (snap.exists()) setRole(snap.data().type);
      }
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold dark:bg-slate-900 dark:text-white">Loading BarberConnect...</div>;

  return (
    <ThemeProvider>
      <BrowserRouter>
        {/* Pass user and role to the inner component */}
        <AppContent user={user} role={role} />
      </BrowserRouter>
    </ThemeProvider>
  );
}