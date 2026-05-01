"use client";
import React, { useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function RelatedProducts({ children }) {
  const sliderRef = useRef(null);

  const scrollLeft = () => {
    sliderRef.current.scrollBy({
      left: -320,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    sliderRef.current.scrollBy({
      left: 320,
      behavior: "smooth",
    });
  };

  return (
    <div className="w-full bg-gray-50 py-10">
      <div className="w-[95%] max-w-[1200px] mx-auto">

        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl text-black font-semibold">
            Related Products
          </h2>

          <div className="flex gap-3">
            <button
              onClick={scrollLeft}
              className="border p-2 rounded-full text-black cursor-pointer hover:bg-gray-200 transition"
            >
              <FaChevronLeft />
            </button>

            <button
              onClick={scrollRight}
              className="border p-2 rounded-full text-black cursor-pointer hover:bg-gray-200 transition"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>

        {/* FIXED CAROUSEL CONTAINER */}
        <div
          ref={sliderRef}
          className="flex gap-5 overflow-x-auto scroll-smooth no-scrollbar px-2"
        >
          {React.Children.map(children, (child) => (
            <div className="flex-shrink-0">
              {child}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
