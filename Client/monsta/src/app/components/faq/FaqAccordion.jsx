"use client";

import React, { useState } from "react";

export default function FaqAccordion({ faqs }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="space-y-3">
      {faqs.map((faq, index) => {
        const isOpen = activeIndex === index;

        return (
          <div
            key={faq._id || index}
            className={`overflow-hidden rounded-[3px] border bg-[#f3f3f3] ${
              isOpen
                ? "border-[#c09578] bg-white"
                : "border-[#e7e7e7]"
            }`}
          >
            <button
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`flex w-full items-center justify-between px-4 py-3 text-left text-[16px] font-semibold ${
                isOpen ? "text-[#c09578]" : "text-black"
              }`}
            >
              <span>{faq._faqQuestion}</span>
              <span className="text-[24px] leading-none text-[#b7b7b7]">
                {isOpen ? "-" : "+"}
              </span>
            </button>

            {isOpen && (
              <div className="border-t border-[#c09578] px-4 py-5 text-[15px] leading-7 text-[#25364a]">
                {faq._faqAnswere}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
