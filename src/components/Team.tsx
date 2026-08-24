import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { fetchTeam, TeamMemberItem } from '../lib/dataService';

export default function Team() {
  const [team, setTeam] = useState<TeamMemberItem[]>([]);
  const [selectedMember, setSelectedMember] = useState<TeamMemberItem | null>(null);

  useEffect(() => {
    fetchTeam().then(list => setTeam(list || []));
  }, []);

  const getThumbnailUrl = (url?: string) => {
    if (!url || typeof url !== 'string') return "https://res.cloudinary.com/dfujzs9ml/image/upload/v1774493285/temitope_initiative/t653vvukb9rj1q1zdh0y.png";
    if (url.includes('/uploads/') && !url.includes('/thumbs/') && !url.startsWith('http')) {
      return url.replace('/uploads/', '/uploads/thumbs/');
    }
    return url;
  };

  return (
    <section id="team" className="py-24 bg-soft-smoke relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">Our Leadership</h2>
          <p className="text-gray-600 text-lg">
            Meet the visionaries driving sustainable development and global synergy.
          </p>
        </div>

        {(!team || team.length === 0) ? (
          <div className="text-center text-gray-500 py-12">No team members found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setSelectedMember(member)}
                className="group cursor-pointer bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
              >
                <div className="aspect-[4/5] relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                  <img 
                    src={getThumbnailUrl(member?.imageUrl)} 
                    alt={member?.name || 'Team Member'} 
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (member?.imageUrl && target.src.includes('/thumbs/')) {
                        target.src = member.imageUrl;
                      } else {
                        target.src = "https://res.cloudinary.com/dfujzs9ml/image/upload/v1774493285/temitope_initiative/t653vvukb9rj1q1zdh0y.png";
                      }
                    }}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 bg-gray-100"
                  />
                  {member.isFounder && (
                    <div className="absolute top-4 right-4 bg-royal-blue text-white text-xs font-bold px-3 py-1 rounded-full z-20 shadow-lg">
                      Founder
                    </div>
                  )}
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-serif font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-vibrant-red font-medium text-sm uppercase tracking-wider">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMember(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl overflow-hidden max-w-4xl w-full shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
            >
              <div className="w-full md:w-2/5 h-64 md:h-auto relative bg-gray-100">
                <img 
                  src={selectedMember.imageUrl || "https://res.cloudinary.com/dfujzs9ml/image/upload/v1774493285/temitope_initiative/t653vvukb9rj1q1zdh0y.png"} 
                  alt={selectedMember.name} 
                  onError={(e) => {
                    e.currentTarget.src = "https://res.cloudinary.com/dfujzs9ml/image/upload/v1774493285/temitope_initiative/t653vvukb9rj1q1zdh0y.png";
                  }}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-full md:w-3/5 p-8 md:p-12 relative overflow-y-auto">
                <button 
                  onClick={() => setSelectedMember(null)}
                  className="absolute top-6 right-6 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X size={20} className="text-gray-600" />
                </button>
                
                {selectedMember.isFounder && (
                  <span className="text-royal-blue font-bold text-xs uppercase tracking-widest mb-2 block">
                    Founder & Visionary
                  </span>
                )}
                <h3 className="text-3xl font-serif font-bold text-gray-900 mb-2">{selectedMember.name}</h3>
                <p className="text-vibrant-red font-medium mb-8">{selectedMember.role}</p>
                
                <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {selectedMember.bio}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
