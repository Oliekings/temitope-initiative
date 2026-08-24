import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <section ref={ref} className="relative h-[100vh] min-h-[800px] flex items-center overflow-hidden bg-soft-smoke">
      {/* Background Image with Parallax */}
      <motion.div 
        style={{ y, opacity }}
        className="absolute inset-0 z-0"
      >
        <img 
          src="https://res.cloudinary.com/dfujzs9ml/image/upload/v1774492823/CI0A5441_mbne9q.jpg" 
          alt="Community Development" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-soft-smoke via-soft-smoke/80 to-transparent" />
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-20">
        
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-xl"
        >
          <div className="inline-block px-4 py-1.5 rounded-full bg-royal-blue/10 text-royal-blue font-semibold text-xs tracking-widest uppercase mb-6">
            Visionary Leadership
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-gray-900 leading-[1.1] mb-6">
            Empowering <br/>
            <span className="text-royal-blue italic">Societal</span> <br/>
            Development.
          </h1>
          <p className="text-lg text-gray-600 mb-10 leading-relaxed">
            Temitope Societal Sustainability and Development Initiative (Temitope Initiative) is dedicated to fostering global synergy, economic empowerment, and peace building.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <motion.a 
              href="#impact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block px-8 py-4 bg-royal-blue text-white rounded-full font-semibold shadow-lg shadow-royal-blue/30 transition-all text-center"
            >
              Discover Our Impact
            </motion.a>
            <motion.a 
              href="#donate"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block px-8 py-4 bg-white text-gray-900 rounded-full font-semibold shadow-sm border border-gray-200 hover:border-gray-300 transition-all text-center"
            >
              Partner / Donate
            </motion.a>
          </div>
        </motion.div>

        {/* Founder Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: 50 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative hidden lg:block h-[600px]"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-royal-blue/20 to-transparent rounded-3xl transform rotate-3 scale-105" />
          <img 
            src="/uploads/file-1774602405327-507864585.webp" 
            alt="Founder - Dr. Mrs. Elizabeth Egbetokun" 
            onError={(e) => {
              const target = e.currentTarget;
              if (target.src !== "https://res.cloudinary.com/dfujzs9ml/image/upload/v1774602830/dr-mrs-elizabeth-egbetokun_hsrvuj.jpg") {
                target.src = "https://res.cloudinary.com/dfujzs9ml/image/upload/v1774602830/dr-mrs-elizabeth-egbetokun_hsrvuj.jpg";
              }
            }}
            className="w-full h-full object-cover rounded-3xl shadow-2xl relative z-10 bg-gray-100"
          />
          
          {/* Floating Badge */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl z-20 max-w-[240px]"
          >
            <div className="text-4xl font-serif font-bold text-vibrant-red mb-2">10+</div>
            <div className="text-sm font-medium text-gray-600">Years of driving sustainable global impact.</div>
          </motion.div>
        </motion.div>
        
      </div>
    </section>
  );
}
