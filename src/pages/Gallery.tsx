/* 
  Developed by Surprise-MFs Tech 
  Full Gallery Page for Temitope Initiative
*/
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { fetchGallery, GalleryItem } from '../lib/dataService';

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGallery().then(list => {
      setImages(list);
      setLoading(false);
    });
  }, []);

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + images.length) % images.length);
    }
  };

  // Helper to get thumbnail URL
  const getThumbnailUrl = (url: string) => {
    if (!url || typeof url !== 'string') return url;
    if (url.includes('/uploads/') && !url.includes('/thumbs/') && !url.startsWith('http')) {
      return url.replace('/uploads/', '/uploads/thumbs/');
    }
    return url;
  };

  // Prevent right-click on images
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="w-12 h-12 border-4 border-royal-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-soft-smoke pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-serif font-bold text-gray-900 mb-4">Impact Gallery</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            A comprehensive visual journey of our global initiatives, community projects, and the lives we've touched.
          </p>
        </div>

        {images.length === 0 ? (
          <div className="text-center text-gray-500 py-24 bg-white rounded-3xl shadow-sm">
            No images in the gallery yet. Check back soon!
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {images.map((img, i) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="break-inside-avoid relative group rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500"
                onClick={() => setSelectedImage(i)}
                onContextMenu={handleContextMenu}
              >
                <img 
                  src={getThumbnailUrl(img.imageUrl)} 
                  alt={img.title} 
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src.includes('/thumbs/')) {
                      target.src = img.imageUrl;
                    }
                  }}
                  className="w-full h-auto object-cover select-none pointer-events-none min-h-[100px] bg-gray-100"
                  loading="lazy"
                  onDragStart={(e) => e.preventDefault()}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <h3 className="text-white font-serif font-medium text-lg mb-1">{img.title}</h3>
                  {img.description && <p className="text-white/80 text-xs line-clamp-2">{img.description}</p>}
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
        {selectedImage !== null && (
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
                src={images[selectedImage].imageUrl} 
                alt={images[selectedImage].title} 
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
    </div>
  );
}
