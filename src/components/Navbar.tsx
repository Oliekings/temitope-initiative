import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { DonationModal } from './Donation';
import { Heart, Menu, X } from 'lucide-react';

const FALLBACK_LOGO = "https://res.cloudinary.com/dfujzs9ml/image/upload/v1774493285/temitope_initiative/t653vvukb9rj1q1zdh0y.png";

export default function Navbar({ siteSettings }: { siteSettings: any | null }) {
  const { isAdmin } = useAuth();
  const location = useLocation();
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoSrc, setLogoSrc] = useState(siteSettings?.logoUrl || FALLBACK_LOGO);

  const isHome = location.pathname === '/';

  const handleSupportClick = (e: React.MouseEvent) => {
    if (isHome) {
      const element = document.getElementById('donate');
      if (element) {
        e.preventDefault();
        element.scrollIntoView({ behavior: 'smooth' });
        setMobileMenuOpen(false);
        return;
      }
    }
    // If not on home or element not found, open modal
    setIsDonationOpen(true);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src={logoSrc} 
              alt="Temitope Initiative Logo" 
              onError={() => setLogoSrc(FALLBACK_LOGO)}
              className="w-12 h-12 object-contain group-hover:scale-105 transition-transform"
            />
            <span className="font-serif font-bold text-xl tracking-tight text-royal-blue group-hover:text-blue-800 transition-colors">
              {siteSettings?.name || "Temitope Initiative"}
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="/#objectives" className="text-sm font-semibold text-gray-600 hover:text-royal-blue transition-colors">Objectives</a>
            <a href="/#team" className="text-sm font-semibold text-gray-600 hover:text-royal-blue transition-colors">Team</a>
            <a href="/#impact" className="text-sm font-semibold text-gray-600 hover:text-royal-blue transition-colors">Impact</a>
            <Link to="/gallery" className="text-sm font-semibold text-gray-600 hover:text-royal-blue transition-colors">Gallery</Link>
            
            <button 
              onClick={handleSupportClick}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-lime-green text-white text-sm font-bold rounded-full hover:bg-green-600 transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              <Heart size={15} className="fill-current text-white" />
              Support Us
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-3">
            <button 
              onClick={() => setIsDonationOpen(true)}
              className="px-4 py-2 bg-lime-green text-white text-xs font-bold rounded-full hover:bg-green-600 transition-all"
            >
              Support Us
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-700 hover:text-royal-blue"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 px-6 py-6 space-y-4 shadow-xl">
            <a 
              href="/#objectives" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-semibold text-gray-700 hover:text-royal-blue py-1"
            >
              Objectives
            </a>
            <a 
              href="/#team" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-semibold text-gray-700 hover:text-royal-blue py-1"
            >
              Leadership Team
            </a>
            <a 
              href="/#impact" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-semibold text-gray-700 hover:text-royal-blue py-1"
            >
              Impact
            </a>
            <Link 
              to="/gallery" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-semibold text-gray-700 hover:text-royal-blue py-1"
            >
              Full Gallery
            </Link>
            <div className="pt-2">
              <button 
                onClick={handleSupportClick}
                className="w-full py-3 bg-lime-green text-white text-center font-bold rounded-xl shadow-md flex items-center justify-center gap-2"
              >
                <Heart size={16} className="fill-current text-white" />
                Support & Bank Details
              </button>
            </div>
          </div>
        )}
      </motion.nav>

      {/* Donation Quick Modal */}
      <DonationModal isOpen={isDonationOpen} onClose={() => setIsDonationOpen(false)} />
    </>
  );
}
