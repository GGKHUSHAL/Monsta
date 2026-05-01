"use client";

import ProductCard from "@/app/common/ProductCard";
import React, { useState } from "react";

export default function TabSection({ productData }) {
  let [activeTab, setActiveTab] = useState("featured");

  let allProducts = productData?.data || [];

  // default me sirf featured products dikhao
  let featuredProducts = allProducts.filter(
    (item) =>
      item._productType?.toLowerCase() === "featured"
  );

  let [products, setProducts] = useState(featuredProducts);

  let changeTab = (type) => {
    setActiveTab(type);

    let filterData = allProducts.filter(
      (item) =>
        item._productType?.toLowerCase() === type.toLowerCase()
    );

    setProducts(filterData);
  };

  return (
    <div className="w-full py-10 bg-white">
      
      {/* Tabs */}
      <div className="flex justify-center items-center mb-5">
        <div className="inline-flex border">

          <button
            onClick={() => changeTab("featured")}
            className={`px-8 py-3 font-semibold border ${
              activeTab === "featured"
                ? "border-orange-400 text-orange-500"
                : "text-black"
            }`}
          >
            Featured
          </button>

          <button
            onClick={() => changeTab("new arrivals")}
            className={`px-8 py-3 font-semibold border-l ${
              activeTab === "new arrivals"
                ? "text-orange-500"
                : "text-black"
            }`}
          >
            New Arrivals
          </button>

          <button
            onClick={() => changeTab("onsale")}
            className={`px-8 py-3 font-semibold border-l ${
              activeTab === "onsale"
                ? "text-orange-500"
                : "text-black"
            }`}
          >
            Onsale
          </button>

        </div>
      </div>

      {/* Products */}
      <div className="w-[1170px] m-auto flex justify-center items-center flex-wrap gap-4">
        {products.length > 0 ? (
          products.map((item, index) => (
            <ProductCard key={index} data={item} />
          ))
        ) : (
          <h2 className="text-xl text-gray-500">
            No Product Found
          </h2>
        )}
      </div>

    </div>
  );
}