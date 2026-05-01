// src/app/components/home/TopRatedProducts.jsx

import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { getRandomTopRatedProducts } from "@/app/services/homeServices";

export default async function TopRatedProducts() {
  noStore();

  let topRatedProducts =
    (await getRandomTopRatedProducts())?.data || [];

  return (
    <div>

      <h3 className="text-[20px] text-black font-semibold mb-6">
        Top Rated Products
      </h3>

      {topRatedProducts.map(
        (
          item,
          index
        ) => (
          <div
            key={index}
          >

            <Link
              href={`/product/${item.slug}`}
              className="flex items-center mb-4 group"
            >

              <img
                src={
                  item.imagePath
                }
                className="mr-4 border object-cover"
                alt={
                  item._productName
                }
                width={78.3}
                height={78.3}
              />

              <div>

                <p className="text-[14px] text-gray-600">
                  {
                    item
                      ?._productParentCategory
                      ?._categoryName
                  }
                </p>

                <p className="text-[15px] font-medium text-gray-800 group-hover:text-[#C09578] transition">
                  {
                    item._productName
                  }
                </p>

                <p className="text-[14px]">

                  <span className="line-through text-gray-400">
                    Rs.{" "}
                    {
                      item._productPrice
                    }
                  </span>{" "}

                  <span className="text-[#C09578] font-bold">
                    Rs.{" "}
                    {
                      item._productSalePrice
                    }
                  </span>

                </p>

              </div>

            </Link>

            {index !==
              topRatedProducts.length -
                1 && (
              <hr className="my-3" />
            )}

          </div>
        )
      )}

    </div>
  );
}
