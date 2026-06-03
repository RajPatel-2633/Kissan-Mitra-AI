import React, { useState, useEffect } from 'react';
import slide1 from '../assets/Smart Weather Updates.png';
import slide2 from '../assets/Detect Crop Diseases in Seconds.png';
import slide3 from '../assets/Natural Remedies First.png';
import slide4 from '../assets/Right Fertilisers, Better Results.png';

const CAROUSEL_IMAGES = [
  slide1,
  slide2,
  slide3,
  slide4
];

const DashboardPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === CAROUSEL_IMAGES.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-8 pb-10">
      
      {/* Auto-rolling Image Carousel */}
      <div className="relative w-full h-[360px] md:h-[480px] rounded-[24px] overflow-hidden shadow-sm group bg-white border border-gray-100">
        
        <div 
          className="flex transition-transform duration-700 ease-in-out h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {CAROUSEL_IMAGES.map((src, idx) => (
            <div key={idx} className="min-w-full h-full relative">
              <img src={src} alt={`Slide ${idx + 1}`} className="w-full h-full object-cover object-center block" />
            </div>
          ))}
        </div>

        {/* Indicators */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
          {CAROUSEL_IMAGES.map((_, idx) => (
            <button 
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-[#15803d] w-8' : 'bg-gray-300/80 w-2 hover:bg-gray-400'}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
        
      </div>
      
    </div>
  );
};

export default DashboardPage;
