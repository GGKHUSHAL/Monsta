"use client";

import React, { useState } from "react";
import { FaStar } from "react-icons/fa";

const fallbackReviews = [
  {
    _id: "fallback-1",
    _testimonialName: "Kathy Young",
    _testimonialMessage:
      "These guys have been absolutely outstanding. Perfect themes and helpful support made the whole experience easy.",
    _testimonialDesignation: "CEO of SunPark",
    _testimonialRating: 5,
    imagePath: "/customer1.jpg",
  },
  {
    _id: "fallback-2",
    _testimonialName: "John Doe",
    _testimonialMessage:
      "Amazing service and great quality products. I am very satisfied with the support and overall experience.",
    _testimonialDesignation: "Marketing Manager",
    _testimonialRating: 5,
    imagePath: "/customer2.jpg",
  },
  {
    _id: "fallback-3",
    _testimonialName: "Sarah Smith",
    _testimonialMessage:
      "Fantastic experience from start to finish. Customer support was helpful and delivery was super fast.",
    _testimonialDesignation: "Business Owner",
    _testimonialRating: 5,
    imagePath: "/customer3.jpg",
  },
];

export default function TestimonialSlider({ testimonials = [] }) {
  const reviews = testimonials.length > 0 ? testimonials : fallbackReviews;
  const [active, setActive] = useState(0);

  return (
    <section className="w-full overflow-hidden bg-white py-16">
      <div className="mx-auto w-[95%] max-w-[1000px] text-center">
        <h2 className="mb-8 text-3xl font-bold text-black">
          What Our Customers Say ?
        </h2>

        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(-${active * 100}%)`,
            }}
          >
            {reviews.map((item, index) => {
              const rating = Math.max(
                1,
                Math.min(5, Number(item._testimonialRating) || 5)
              );

              return (
                <article
                  key={item._id || index}
                  className="min-w-full px-4"
                >
                  <p className="mb-8 leading-relaxed text-gray-600">
                    {item._testimonialMessage}
                  </p>

                  <div className="mb-3 flex justify-center">
                    <img
                      src={item.imagePath || item.image || "/customer1.jpg"}
                      alt={item._testimonialName || "Customer"}
                      className="h-20 w-20 rounded-full object-cover"
                    />
                  </div>

                  <h3 className="text-lg font-semibold uppercase text-black">
                    {item._testimonialName}
                  </h3>

                  {item._testimonialDesignation && (
                    <p className="mb-3 text-sm text-gray-500">
                      {item._testimonialDesignation}
                    </p>
                  )}

                  <div className="mb-5 flex justify-center gap-1 text-[#c89a7b]">
                    {[...Array(rating)].map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="mt-5 flex justify-center gap-2">
          {reviews.map((_, index) => (
            <button
              type="button"
              key={index}
              onClick={() => setActive(index)}
              aria-label={`Show testimonial ${index + 1}`}
              className={`h-3 rounded-full transition-all ${
                active === index
                  ? "w-4 bg-[#c89a7b]"
                  : "w-3 bg-gray-300"
              }`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
}
