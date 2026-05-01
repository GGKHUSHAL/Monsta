"use client";

import React, { useEffect, useState } from "react";
import { FaAngleDoubleUp } from "react-icons/fa";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 250);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      className={`fixed bottom-8 right-4 z-[9998] flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[#212121] text-white shadow-lg transition-all duration-300 hover:bg-[#C09578] ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <FaAngleDoubleUp className="text-[16px]" />
    </button>
  );
}
