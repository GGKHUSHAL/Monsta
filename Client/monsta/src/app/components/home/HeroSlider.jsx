"use client";

import React, { useEffect, useRef, useState } from "react";

const fallbackSlides = [
  {
    _id: "fallback-1",
    _sliderTitle: "New Furniture Collection",
    _sliderSubTitle: "Discover fresh designs for your home",
    _sliderButtonText: "Shop Now",
    _sliderButtonLink: "/",
    imagePath: "/slider1.jpg",
  },
  {
    _id: "fallback-2",
    _sliderTitle: "Modern Living Room",
    _sliderSubTitle: "Comfortable furniture crafted for everyday living",
    _sliderButtonText: "Explore",
    _sliderButtonLink: "/",
    imagePath: "/slider2.jpg",
  },
  {
    _id: "fallback-3",
    _sliderTitle: "Premium Home Decor",
    _sliderSubTitle: "Bring timeless style into every corner",
    _sliderButtonText: "View More",
    _sliderButtonLink: "/",
    imagePath: "/slider3.jpg",
  },
];

export default function HeroSlider({ sliders = [] }) {
  const slides = sliders.length > 0 ? sliders : fallbackSlides;
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 8000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].screenX;

    if (touchStartX.current - touchEndX.current > 50) {
      nextSlide();
    }

    if (touchStartX.current - touchEndX.current < -50) {
      prevSlide();
    }
  };

  return (
    <section
      className="relative h-[500px] w-full overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {slides.map((slide, index) => (
        <div
          key={slide._id || index}
          className={`absolute z-10 h-full w-full transition-opacity duration-700 ease-in-out ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={slide.imagePath || slide.image || "/slider1.jpg"}
            alt={slide._sliderTitle || "Monsta furniture slider"}
            className="h-full w-full object-cover"
          />
        </div>
      ))}

      <div className="absolute bottom-5 left-0 right-0 z-20 flex justify-center gap-2">
        {slides.map((_, index) => (
          <button
            type="button"
            key={index}
            onClick={() => setCurrent(index)}
            aria-label={`Show slide ${index + 1}`}
            className={`h-3 w-3 rounded-full ${
              index === current ? "bg-[#C09578]" : "bg-gray-300"
            }`}
          ></button>
        ))}
      </div>
    </section>
  );
}
