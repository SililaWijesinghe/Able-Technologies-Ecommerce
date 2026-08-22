import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import FloatingControls from './components/FloatingControls';
import Home from './pages/Home';
import Contact from './pages/Contact';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans overflow-x-hidden">
        {/* SVG Gradient Defs */}
        <svg width="0" height="0" className="absolute">
          <defs>
            <linearGradient id="metal-red" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff4b4b" />
              <stop offset="45%" stopColor="#d41414" />
              <stop offset="100%" stopColor="#7a0000" />
            </linearGradient>
          </defs>
        </svg>

        <Header />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        
        <Footer />
        <FloatingControls />
      </div>
    </Router>
  );
}
