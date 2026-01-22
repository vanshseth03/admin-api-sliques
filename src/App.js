import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BookingProvider } from './context/BookingContext';
import { AdminProvider } from './context/AdminContext';
import Header from './components/Header';
import Footer from './components/Footer';
import FloatingCallButton from './components/FloatingCallButton';
import WelcomeAnimation from './components/WelcomeAnimation';
import Home from './pages/Home';
import Services from './pages/Services';
import Customizer from './pages/Customizer';
import Booking from './pages/Booking';
import OrderTracking from './pages/OrderTracking';
import FAQ from './pages/FAQ';
import Admin from './pages/Admin';
import Contact from './pages/Contact';

function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <BookingProvider>
      <AdminProvider>
        {showWelcome && <WelcomeAnimation onComplete={() => setShowWelcome(false)} />}
        <Router>
          <div className="min-h-screen flex flex-col bg-ivory">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/services" element={<Services />} />
                <Route path="/customizer" element={<Customizer />} />
                <Route path="/booking" element={<Booking />} />
                <Route path="/track-order" element={<OrderTracking />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </main>
            <Footer />
            <FloatingCallButton />
          </div>
        </Router>
      </AdminProvider>
    </BookingProvider>
  );
}

export default App;
