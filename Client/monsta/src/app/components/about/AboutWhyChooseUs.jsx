import React from "react";

export default function AboutWhyChooseUs({ data = [] }) {
  if (data.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-white py-16">
      <div className="mx-auto max-w-[1200px] px-4">
        <h2 className="mb-10 text-center text-3xl font-semibold md:text-4xl">
          Why Choose Us?
        </h2>

        <div className="grid grid-cols-1 gap-10 text-center md:grid-cols-3">
          {data.map((item) => (
            <article key={item._id} className="text-black">
              {item.imagePath && (
                <div className="mb-6 overflow-hidden">
                  <img
                    src={item.imagePath}
                    alt={item._aboutWhyChooseTitle || "About why choose us"}
                    className="h-[280px] w-full object-cover"
                  />
                </div>
              )}

              <h3 className="mb-4 text-lg font-semibold">
                {item._aboutWhyChooseTitle}
              </h3>

              <p className="text-[15px] leading-7 text-gray-600">
                {item._aboutWhyChooseDescription}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
