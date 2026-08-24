import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchGallery, GalleryItem } from '../lib/dataService';

export default function Gallery() {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  useEffect(() => {
    fetchGallery().then(list => setImages(list || []));
  }, []);

  const nextImage = () => {
    if (selectedImage !== null && images.length > 0) {
      setSelectedImage((selectedImage + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null && images.length > 0) {
      setSelectedImage((selectedImage - 1 + images.length) % images.length);
    }
  };

  const getThumbnailUrl = (url?: string) => {
    if (!url || typeof url !== 'string') return "https://res.cloudinary.com/dfujzs9ml/image/upload/v1774493285/temitope_initiative/t653vvukb9rj1q1zdh0y.png";
    if (url.includes('/uploads/') && !url.includes('/thumbs/') && !url.startsWith('http')) {
      return url.replace('/uploads/', '/uploads/thumbs/');
    }
    return url;
  };

  // Prevent right-click on images
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <section id="impact" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">Impact Gallery</h2>
            <p className="text-gray-600 text-lg">
              Visual stories of empowerment, leadership, and community development across the globe.
            </p>
          </div>
          <Link 
            to="/gallery"
            className="px-6 py-2 border border-gray-200 rounded-full text-sm font-semibold hover:bg-gray-50 transition-colors whitespace-nowrap"
          >
            View All Images
          </Link>
        </div>

        {(!images || images.length === 0) ? (
          <div className="text-center text-gray-500 py-12">No images found.</div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {images.slice(0, 6).map((img, i) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 3) * 0.1 }}
                className="break-inside-avoid relative group rounded-2xl overflow-hidden cursor-pointer"
                onClick={() => setSelectedImage(i)}
                onContextMenu={handleContextMenu}
              >
                <img 
                  src={getThumbnailUrl(img.imageUrl)} 
                  alt={img.title || 'Impact Image'} 
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (img?.imageUrl && target.src.includes('/thumbs/')) {
                      target.src = img.imageUrl;
                    } else {
                      target.src = "https://res.cloudinary.com/dfujzs9ml/image/upload/v1774493285/temitope_initiative/t653vvukb9rj1q1zdh0y.png";
                    }
                  }}
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 select-none pointer-events-none bg-gray-100"
                  loading="lazy"
                  onDragStart={(e) => e.preventDefault()}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <h3 className="text-white font-serif font-medium text-lg">{img.title}</h3>
                  <div className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white">
                    <Maximize2 size={16} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox / Popup */}
      <AnimatePresence>
        {selectedImage !== null && images[selectedImage] && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-[110]"
              onClick={() => setSelectedImage(null)}
            >
              <X size={32} />
            </button>

            <button 
              className="absolute left-4 md:left-10 text-white/50 hover:text-white transition-colors z-[110] p-2 bg-white/5 rounded-full"
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
            >
              <ChevronLeft size={40} />
            </button>

            <button 
              className="absolute right-4 md:right-10 text-white/50 hover:text-white transition-colors z-[110] p-2 bg-white/5 rounded-full"
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
            >
              <ChevronRight size={40} />
            </button>

            <motion.div 
              key={selectedImage}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative max-w-5xl w-full max-h-full flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
              onContextMenu={handleContextMenu}
            >
              <img 
                src={images[selectedImage].imageUrl || "https://res.cloudinary.com/dfujzs9ml/image/upload/v1774493285/temitope_initiative/t653vvukb9rj1q1zdh0y.png"} 
                alt={images[selectedImage].title || ''} 
                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl select-none pointer-events-none"
                onDragStart={(e) => e.preventDefault()}
              />
              <div className="mt-8 text-center max-w-2xl">
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-3">
                  {images[selectedImage].title}
                </h2>
                {images[selectedImage].description && (
                  <p className="text-white/70 text-lg leading-relaxed">
                    {images[selectedImage].description}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
