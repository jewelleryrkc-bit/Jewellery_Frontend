"use client";

import { useState, useEffect, SetStateAction } from "react";

const slides = [
  {
    bgColor: "bg-amber-50",
    title: "Elegant jewelery",
    subtitle: "Discover our exquisite collection of handcrafted jewelry",
    cta: "Shop Now"
  },
  {
    bgColor: "bg-rose-50",
    title: "Summer Collection",
    subtitle: "New arrivals for the season - limited edition pieces",
    cta: "View Collection"
  },
  {
    bgColor: "bg-stone-100",
    title: "Luxury Redefined",
    subtitle: "Fine jewelry that tells your unique story",
    cta: "Explore Designs"
  }
];

export default function CompactFullScreenCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === slides.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: SetStateAction<number>) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full h-[60vh] md:h-[90vh] max-h-[800px] overflow-hidden rounded-b-xl shadow-xl">
      {/* Slides container */}
      <div
        className="flex h-full transition-transform duration-700 ease-[cubic-bezier(0.33,1,0.68,1)]"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={index} className={`w-full h-full flex-shrink-0 relative ${slide.bgColor}`}>
            {/* Content area with jewelry-focused text */}
            <div className="absolute inset-0 flex items-center justify-center text-center px-4 md:px-8">
              <div className="text-gray-800 max-w-2xl md:max-w-3xl px-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 md:mb-4 font-serif">
                  {slide.title}
                </h1>
                <p className="text-base sm:text-lg md:text-xl mb-4 md:mb-6 font-light">
                  {slide.subtitle}
                </p>
                <button className="bg-gray-800 text-white px-6 py-2 md:px-8 md:py-3 rounded-full font-medium hover:bg-gray-700 transition-all text-sm md:text-base tracking-wider">
                  {slide.cta}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Dots Indicator */}
      <div className="absolute bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 md:space-x-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2.5 w-2.5 md:h-2 md:w-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? "bg-gray-800 md:w-4" 
                : "bg-gray-800/50 hover:bg-gray-800/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>
      
      {/* Navigation Arrows */}
      {!isMobile && (
        <>
          <button 
            onClick={() => setCurrentIndex(prev => prev === 0 ? slides.length - 1 : prev - 1)}
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 bg-gray-800/20 hover:bg-gray-800/40 text-gray-800 p-2 rounded-full transition-all duration-300 z-10"
            aria-label="Previous slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={() => setCurrentIndex(prev => prev === slides.length - 1 ? 0 : prev + 1)}
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 bg-gray-800/20 hover:bg-gray-800/40 text-gray-800 p-2 rounded-full transition-all duration-300 z-10"
            aria-label="Next slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}
      
      {/* Mobile swipe instructions */}
      {isMobile && (
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-gray-800/80 text-xs">
          Swipe to explore
        </div>
      )}
    </div>
  );
}