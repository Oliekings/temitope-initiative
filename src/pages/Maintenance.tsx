/* 
  Developed by Surprise-MFs Tech 
  Maintenance Page for Temitope Initiative
*/
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Hammer, Wrench, Clock, Heart } from 'lucide-react';

interface MaintenanceProps {
  estimatedEndTime?: any; // Can be string or Firestore Timestamp
}

export default function Maintenance({ estimatedEndTime }: MaintenanceProps) {
  const [timeLeft, setTimeLeft] = useState<{ hours: number, minutes: number, seconds: number } | null>(null);

  useEffect(() => {
    if (!estimatedEndTime) {
      setTimeLeft(null);
      return;
    }

    const timer = setInterval(() => {
      // Handle both string and Firestore Timestamp
      let endTime: number;
      if (typeof estimatedEndTime === 'string') {
        endTime = new Date(estimatedEndTime).getTime();
      } else if (estimatedEndTime?.toDate) {
        endTime = estimatedEndTime.toDate().getTime();
      } else if (estimatedEndTime?.seconds) {
        endTime = estimatedEndTime.seconds * 1000;
      } else {
        endTime = new Date(estimatedEndTime).getTime();
      }

      const now = new Date().getTime();
      const diff = endTime - now;

      if (diff <= 0) {
        setTimeLeft(null);
        clearInterval(timer);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, [estimatedEndTime]);

  return (
    <div className="min-h-screen bg-royal-blue flex flex-col items-center justify-center p-6 text-white overflow-hidden relative">
      {/* Animated Background Elements */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-white/5 rounded-full blur-xl"
          style={{
            width: Math.random() * 300 + 100,
            height: Math.random() * 300 + 100,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, Math.random() * 100 - 50],
            x: [0, Math.random() * 100 - 50],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: Math.random() * 10 + 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 text-center max-w-2xl"
      >
        <div className="flex justify-center gap-6 mb-8">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Hammer size={64} className="text-lime-green" />
          </motion.div>
          <motion.div
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          >
            <Wrench size={64} className="text-vibrant-red" />
          </motion.div>
        </div>

        <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 tracking-tight">
          We're Polishing <br />
          <span className="text-lime-green">The Perfection.</span>
        </h1>
        
        <p className="text-xl text-blue-100 mb-12 leading-relaxed">
          Temitope Initiative is currently undergoing scheduled maintenance to improve your experience. 
          We'll be back shortly with even more impact!
        </p>

        {timeLeft && (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 mb-12">
            <div className="flex items-center justify-center gap-2 mb-4 text-lime-green">
              <Clock size={20} />
              <span className="text-sm font-semibold uppercase tracking-widest">Estimated Time Remaining</span>
            </div>
            <div className="flex justify-center gap-8">
              <TimeUnit value={timeLeft.hours} label="Hours" />
              <TimeUnit value={timeLeft.minutes} label="Minutes" />
              <TimeUnit value={timeLeft.seconds} label="Seconds" />
            </div>
          </div>
        )}

        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-blue-200">
            <Heart size={18} className="text-vibrant-red fill-vibrant-red" />
            <span>Thank you for your patience and support.</span>
          </div>
          <p className="text-xs text-blue-300 opacity-60 mb-1">
            &copy; {new Date().getFullYear()} Temitope Initiative. All rights reserved.
          </p>
          <p className="text-xs text-blue-300 opacity-60 font-serif italic">
            Designed & Developed with ♥ for perfection by <span className="text-white font-semibold">Surprise-MFs Tech</span>
          </p>
        </div>
      </motion.div>

      {/* Interactive Hover Element */}
      <motion.div
        className="absolute bottom-10 right-10 cursor-pointer hidden md:block"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20 text-xs font-mono">
          Surprise? Maybe.
        </div>
      </motion.div>
    </div>
  );
}

function TimeUnit({ value, label }: { value: number, label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-4xl md:text-6xl font-bold font-mono">
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-xs uppercase tracking-tighter text-blue-200 mt-1">
        {label}
      </span>
    </div>
  );
}
