// src/app/common/ProductBreadcrumb.jsx

import React from "react";
import Link from "next/link";

export default function ProductBreadcrumb({
  productName,
  categoryName,
  categorySlug,
  subCategoryName,
  subCategorySlug
}) {
  return (
    <section className="bg-[#f8f8f8] py-14 border-t border-b">

      <div className="max-w-[1200px] mx-auto px-4 text-center">

        {/* Title */}
        <h1 className="text-[38px] md:text-[52px] font-semibold text-[#1d1d1d] leading-tight">
          {productName}
        </h1>

        {/* Breadcrumb */}
        <div className="flex justify-center items-center gap-3 mt-5 text-[16px] flex-wrap text-black">

          <Link
            href="/"
            className="hover:text-[#C09578] duration-300"
          >
            Home
          </Link>

          <span>{">"}</span>

          {categoryName && (
            <>
              <Link
                href={`/category/${categorySlug}`}
                className="hover:text-[#C09578] duration-300"
              >
                {categoryName}
              </Link>

              <span>{">"}</span>
            </>
          )}

          {subCategoryName && (
            <>
              <Link
                href={`/subcategory/${subCategorySlug}`}
                className="hover:text-[#C09578] duration-300"
              >
                {subCategoryName}
              </Link>

              <span>{">"}</span>
            </>
          )}

          <span className="text-[#C09578]">
            {productName}
          </span>

        </div>

      </div>

    </section>
  );
}