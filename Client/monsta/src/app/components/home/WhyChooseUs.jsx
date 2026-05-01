import React from "react";
import {
  FaHeadset,
  FaRegCheckCircle,
  FaRegClock,
  FaShippingFast,
} from "react-icons/fa";

const iconMap = {
  FaShippingFast,
  FaRegCheckCircle,
  FaRegClock,
  FaHeadset,
};

const fallbackItems = [
  {
    _id: "fallback-1",
    _whyChooseTitle: "Free Shipping",
    _whyChooseDescription: "Free shipping on all orders",
    icon: <FaShippingFast className="text-2xl" />,
  },
  {
    _id: "fallback-2",
    _whyChooseTitle: "Money Return",
    _whyChooseDescription: "Back guarantee under 7 days",
    icon: <FaRegCheckCircle className="text-2xl" />,
  },
  {
    _id: "fallback-3",
    _whyChooseTitle: "Online Support",
    _whyChooseDescription: "Support online 24 hours a day",
    icon: <FaHeadset className="text-2xl" />,
  },
];

export default function WhyChooseUs({ whyChooseUs = [] }) {
  const items = whyChooseUs.length > 0 ? whyChooseUs : fallbackItems;

  return (
    <section className="w-full bg-gray-100 py-12">
      <div className="mx-auto grid w-[95%] max-w-[1200px] gap-8 text-center md:grid-cols-3">
        {items.map((item, index) => {
          const Icon = iconMap[item._whyChooseIcon];

          return (
            <article
              key={item._id || index}
              className="flex flex-col items-center text-black"
            >
              <div className="mb-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-black">
                {Icon ? (
                  <Icon className="text-2xl text-[#406276]" />
                ) : item.icon ? (
                  item.icon
                ) : item.imagePath ? (
                  <img
                    src={item.imagePath}
                    alt={item._whyChooseTitle || "Why choose Monsta"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <FaRegCheckCircle className="text-2xl text-[#406276]" />
                )}
              </div>

              <h3 className="text-lg font-semibold">
                {item._whyChooseTitle}
              </h3>

              <p className="mt-1 text-sm text-gray-600">
                {item._whyChooseDescription}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
