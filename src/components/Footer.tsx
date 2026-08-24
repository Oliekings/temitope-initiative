import React, { useState } from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import { subscribeEmail } from '../lib/dataService';

export default function Footer({ siteSettings }: { siteSettings: any | null }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus('loading');
    try {
      await subscribeEmail(email);
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error("Subscription error", error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <footer className="bg-royal-blue text-white py-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <img 
              src={siteSettings?.logoUrl || "https://storage.googleapis.com/aistudio-build-assets/temitope-initiative-logo.png"} 
              alt="Logo" 
              className="w-12 h-12 object-contain bg-white rounded-full p-1"
            />
            <span className="font-serif font-semibold text-2xl tracking-tight">
              {siteSettings?.name || "Temitope Initiative"}
            </span>
          </div>
          <p className="text-blue-100 max-w-md leading-relaxed mb-8">
            {siteSettings?.name || "Temitope Initiative"}. 
            Empowering communities through leadership, economic growth, and global synergy.
          </p>
          
          <form onSubmit={handleSubscribe} className="max-w-md">
            <h4 className="font-serif font-semibold text-lg mb-3">Join Our Newsletter</h4>
            <div className="flex gap-2">
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address" 
                className="flex-grow px-4 py-2.5 rounded-full bg-blue-900/50 border border-blue-800 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-lime-green"
              />
              <button 
                type="submit" 
                disabled={status === 'loading' || status === 'success'}
                className="px-6 py-2.5 bg-lime-green text-white font-semibold rounded-full hover:bg-green-600 transition-colors disabled:opacity-70"
              >
                {status === 'loading' ? '...' : status === 'success' ? 'Joined!' : 'Subscribe'}
              </button>
            </div>
            {status === 'error' && <p className="text-red-300 text-sm mt-2">Something went wrong. Please try again.</p>}
          </form>
        </div>
        
        <div>
          <h4 className="font-serif font-semibold text-lg mb-4">Quick Links</h4>
          <ul className="space-y-3 text-sm">
            <li><a href="/#objectives" className="text-blue-200 hover:text-white transition-colors">Our Objectives</a></li>
            <li><a href="/#team" className="text-blue-200 hover:text-white transition-colors">Leadership</a></li>
            <li><a href="/#impact" className="text-blue-200 hover:text-white transition-colors">Impact Gallery</a></li>
            <li><a href="/#donate" className="text-lime-300 hover:text-white font-semibold transition-colors flex items-center gap-1.5">Support & Donation Account</a></li>
          </ul>

          <div className="mt-6 pt-4 border-t border-blue-900/60 text-xs text-blue-200/80">
            <p className="font-semibold text-white mb-1">Official Bank:</p>
            <p>Zenith Bank Plc (Kebbi House)</p>
            <p className="font-mono text-lime-300 text-[11px] mt-0.5">NGN: 1311816265</p>
            <p className="font-mono text-lime-300 text-[11px]">USD: 5075911468</p>
          </div>
        </div>
        
        <div className="md:col-span-1">
          <h4 className="font-serif font-semibold text-lg mb-6">Connect With Us</h4>
          <ul className="space-y-4">
            {(siteSettings?.emails || (siteSettings?.contactEmail ? [siteSettings?.contactEmail] : ["contact@temitopessdi.org"])).map((email: string) => (
              <li key={email} className="flex items-center gap-3 group">
                <div className="p-2 bg-blue-900/30 rounded-lg text-lime-green group-hover:bg-lime-green group-hover:text-white transition-all">
                  <Mail size={16} />
                </div>
                <a href={`mailto:${email}`} className="text-blue-200 hover:text-white transition-colors text-sm break-all font-medium">{email}</a>
              </li>
            ))}
            {(siteSettings?.phones || []).map((phone: string) => (
              <li key={phone} className="flex items-center gap-3 group">
                <div className="p-2 bg-blue-900/30 rounded-lg text-lime-green group-hover:bg-lime-green group-hover:text-white transition-all">
                  <Phone size={16} />
                </div>
                <a href={`tel:${phone}`} className="text-blue-200 hover:text-white transition-colors text-sm font-medium">{phone}</a>
              </li>
            ))}
            {(siteSettings?.addresses || []).map((address: string) => (
              <li key={address} className="flex items-start gap-3 group">
                <div className="p-2 bg-blue-900/30 rounded-lg text-lime-green group-hover:bg-lime-green group-hover:text-white transition-all mt-0.5">
                  <MapPin size={16} />
                </div>
                <span className="text-blue-200 text-sm leading-relaxed font-medium">{address}</span>
              </li>
            ))}
          </ul>

          {(siteSettings?.socials || []).some((s: any) => s.enabled) && (
            <div className="mt-8 flex flex-wrap gap-3">
              {siteSettings.socials.filter((s: any) => s.enabled).map((social: any) => {
                const Icon = social.platform === 'Facebook' ? Facebook :
                             social.platform === 'Instagram' ? Instagram :
                             social.platform === 'Twitter' ? Twitter :
                             social.platform === 'LinkedIn' ? Linkedin : null;
                if (!Icon) return null;
                return (
                  <a 
                    key={social.platform} 
                    href={social.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-10 h-10 flex items-center justify-center bg-blue-900/50 rounded-xl text-blue-200 hover:text-white hover:bg-blue-600 hover:scale-110 transition-all border border-blue-800/50 shadow-lg"
                    title={social.platform}
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-blue-800 text-center text-blue-300 text-sm">
        <p className="mb-2">&copy; {new Date().getFullYear()} Temitope Initiative. All rights reserved.</p>
        <p className="font-serif italic">
          Designed & Developed with ♥ for perfection by <span className="text-white font-semibold">Surprise-MFs Tech</span>
        </p>
      </div>
    </footer>
  );
}
