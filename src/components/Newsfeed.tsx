import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight } from 'lucide-react';
import { fetchEvents, EventItem } from '../lib/dataService';

export default function Newsfeed() {
  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    fetchEvents().then(list => setEvents(list || []));
  }, []);

  const getThumbnailUrl = (url?: string) => {
    if (!url || typeof url !== 'string') return "https://res.cloudinary.com/dfujzs9ml/image/upload/v1774493285/temitope_initiative/t653vvukb9rj1q1zdh0y.png";
    if (url.includes('/uploads/') && !url.includes('/thumbs/') && !url.startsWith('http')) {
      return url.replace('/uploads/', '/uploads/thumbs/');
    }
    return url;
  };

  const formatDate = (dateVal: any) => {
    if (!dateVal) return 'Upcoming';
    try {
      if (dateVal.toDate) {
        return new Date(dateVal.toDate()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      }
      return new Date(dateVal).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return 'Upcoming';
    }
  };

  return (
    <section id="news" className="py-24 bg-soft-smoke overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">Latest Updates</h2>
            <p className="text-gray-600 text-lg">
              Stay informed about our recent initiatives, upcoming events, and community milestones.
            </p>
          </div>
        </div>

        {(!events || events.length === 0) ? (
          <div className="text-center text-gray-500 py-12">No events found.</div>
        ) : (
          <div className="flex overflow-x-auto gap-8 pb-12 snap-x snap-mandatory hide-scrollbar">
            {events.map((evt, i) => {
              const primaryImage = evt.imageUrls?.[0] || evt.imageUrl;
              return (
                <motion.div
                  key={evt.id}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="min-w-[320px] md:min-w-[400px] bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 snap-center group flex flex-col"
                >
                  <div className="h-56 overflow-hidden relative">
                    <img 
                      src={getThumbnailUrl(primaryImage)} 
                      alt={evt.title || 'Event'} 
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (primaryImage && target.src.includes('/thumbs/')) {
                          target.src = primaryImage;
                        } else {
                          target.src = "https://res.cloudinary.com/dfujzs9ml/image/upload/v1774493285/temitope_initiative/t653vvukb9rj1q1zdh0y.png";
                        }
                      }}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 bg-gray-100"
                      loading="lazy"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2 text-sm font-semibold text-royal-blue shadow-sm">
                      <Calendar size={14} />
                      {formatDate(evt.date)}
                    </div>
                  </div>
                  <div className="p-8 flex-grow flex flex-col">
                    <h3 className="text-xl font-serif font-bold text-gray-900 mb-3 line-clamp-2">{evt.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">{evt.description}</p>
                    <button className="flex items-center gap-2 text-royal-blue font-semibold text-sm hover:text-blue-800 transition-colors mt-auto group/btn">
                      Read Full Story
                      <ArrowRight size={16} className="transform group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
