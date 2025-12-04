"use client";

import { useState, useEffect, SetStateAction } from "react";
import Image from "next/image";
import Link from "next/link";

const slides = [
  {
    title: "Elegant Jewellery",
    subtitle: "Discover our exquisite collection of handcrafted jewelry",
    cta: "Shop Now",
    image: "/images/carousel/carousel_01.jpg",
    link: "/category/gold-jewellery", // 1st slide
  },
  {
    title: "Summer Collection",
    subtitle: "New arrivals for the season - limited edition pieces",
    cta: "View Collection",
    image: "/images/carousel/carousel_02.avif",
    link: "/category/necklaces", // 2nd slide
  },
  {
    title: "Luxury Redefined",
    subtitle: "Fine jewelry that tells your unique story",
    cta: "Explore Designs",
    image: "/images/carousel/carousel_03.webp",
    link: "/products", // 3rd slide
  },
];

export default function CompactFullScreenCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: SetStateAction<number>) => setCurrentIndex(index);

  return (
    <div className="relative w-full h-[70vh] md:h-[100vh] max-h-[800px] overflow-hidden rounded-b-xl shadow-xl">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Background Image */}
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            style={{ objectFit: "cover" }}
            className="object-cover"
            priority
            // priority={index === 0}
            // fetchPriority={index === 0 ? "high" : "auto"}
          />

          {/* Overlay for readability */}
          <div className="absolute inset-0 bg-black/30"></div>

          {/* Text Content */}
          <div className="absolute inset-0 flex items-center justify-center text-center px-4 md:px-8">
            <div className="text-white max-w-2xl md:max-w-3xl px-4 drop-shadow-lg">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 md:mb-4 font-serif">
                {slide.title}
              </h1>
              <p className="text-base sm:text-lg md:text-xl mb-4 md:mb-6 font-light">
                {slide.subtitle}
              </p>
              <Link href={slide.link}>
                <button className="bg-white text-black px-6 py-2 md:px-8 md:py-3 rounded-full font-medium hover:bg-gray-200 transition-all text-sm md:text-base tracking-wider">
                  {slide.cta}
                </button>
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Dots */}
      <div className="absolute bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 md:space-x-3 z-20">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`h-2.5 w-2.5 md:h-2 md:w-2 rounded-full transition-all duration-300 ${
              idx === currentIndex
                ? "bg-white md:w-4"
                : "bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          ></button>
        ))}
      </div>

      {/* Arrows */}
      {!isMobile && (
        <>
          <button
            onClick={() =>
              setCurrentIndex((prev) =>
                prev === 0 ? slides.length - 1 : prev - 1
              )
            }
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full z-20 transition-all duration-300"
          >
            ‹
          </button>
          <button
            onClick={() =>
              setCurrentIndex((prev) =>
                prev === slides.length - 1 ? 0 : prev + 1
              )
            }
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full z-20 transition-all duration-300"
          >
            ›
          </button>
        </>
      )}

      {/* Mobile swipe hint */}
      {isMobile && (
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-white/80 text-xs z-20">
          Swipe to explore
        </div>
      )}
    </div>
  );
}
