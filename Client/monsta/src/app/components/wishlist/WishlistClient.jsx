"use client";

import React from "react";
import Link from "next/link";
import Breadcrumbs from "@/app/common/Breadcrumbs";
import AuthRequiredPage from "@/app/common/AuthRequiredPage";
import { FaRegHeart, FaRegListAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addToCart } from "@/app/redux/cartSlice";
import {
  removeFromWishlist,
  selectWishlistItems,
} from "@/app/redux/wishlistSlice";

const formatPrice = (value) => Number(value || 0).toLocaleString("en-IN");

export default function WishlistClient() {
  const dispatch = useDispatch();
  const wishlistItems = useSelector(selectWishlistItems);

  const handleAddToCart = (item) => {
    dispatch(
      addToCart({
        product: item.product,
        selectedColor: item.selectedColor,
        selectedMaterial: item.selectedMaterial,
      })
    );
    dispatch(removeFromWishlist(item.id));
    toast.success("Product moved to cart");
  };

  return (
    <AuthRequiredPage message="Please login to view wishlist">
      <main className="min-h-[560px] bg-white">
        <Breadcrumbs tittle="My Wishlist" />

        <div className="mx-auto max-w-[1140px] px-4 pb-16">
          <div className="border-t border-[#ebebeb] pt-10"></div>

          {wishlistItems.length === 0 ? (
            <section className="flex flex-col items-center justify-center py-16 text-center">
              <div className="relative mb-8 flex h-[280px] w-full max-w-[360px] items-center justify-center">
                <div className="absolute h-[250px] w-[280px] rounded-[45%] bg-[#f7f7f7]"></div>
                <div className="relative flex h-[150px] w-[120px] items-center justify-center rounded-lg border-2 border-[#3d5663] bg-white text-[#3d5663]">
                  <FaRegListAlt className="text-[78px]" />
                </div>
                <FaRegHeart className="absolute bottom-10 right-[92px] text-[48px] text-[#ff8a1d]" />
                <div className="absolute bottom-8 h-2 w-[120px] rounded-full bg-[#dedede]"></div>
              </div>

              <p className="text-[14px] text-[#25364a]">
                Your wishlist is empty!
              </p>
              <Link
                href="/product-listing"
                className="mt-5 inline-block bg-[#c09578] px-6 py-3 text-sm font-bold text-white hover:bg-[#a87c5f]"
              >
                Continue Shopping
              </Link>
            </section>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] border border-[#ebebeb] text-center">
                <thead>
                  <tr className="bg-[#f4f4f4] font-[var(--font-playfair)] text-[18px] text-[#111]">
                    <th className="border-b border-[#c09578] px-5 py-4">
                      Delete
                    </th>
                    <th className="border-b border-[#c09578] px-5 py-4">
                      Image
                    </th>
                    <th className="border-b border-[#c09578] px-5 py-4">
                      Product
                    </th>
                    <th className="border-b border-[#c09578] px-5 py-4">
                      Price
                    </th>
                    <th className="border-b border-[#c09578] px-5 py-4">
                      Stock Status
                    </th>
                    <th className="border-b border-[#c09578] px-5 py-4">
                      Add To Cart
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {wishlistItems.map((item) => {
                    const inStock = Number(item.stock || 0) > 0;

                    return (
                      <tr key={item.id}>
                        <td className="border border-[#ebebeb] px-5 py-4">
                          <button
                            type="button"
                            onClick={() => dispatch(removeFromWishlist(item.id))}
                            className="text-[24px] font-bold text-[#c09578] hover:text-[#1f1f23]"
                            aria-label={`Remove ${item.name} from wishlist`}
                          >
                            x
                          </button>
                        </td>
                        <td className="border border-[#ebebeb] px-3 py-4">
                          <Link href={`/product/${item.slug}`}>
                            <img
                              src={item.image}
                              alt={item.name}
                              className="mx-auto h-[128px] w-[200px] object-cover"
                            />
                          </Link>
                        </td>
                        <td className="border border-[#ebebeb] px-5 py-4">
                          <Link
                            href={`/product/${item.slug}`}
                            className="hover:text-[#c09578]"
                          >
                            {item.name}
                          </Link>
                        </td>
                        <td className="border border-[#ebebeb] px-5 py-4 font-bold">
                          Rs. {formatPrice(item.price)}
                        </td>
                        <td className="border border-[#ebebeb] px-5 py-4 font-bold">
                          {inStock ? "In Stock" : "Out Of Stock"}
                        </td>
                        <td className="border border-[#ebebeb] px-5 py-4">
                          <button
                            type="button"
                            disabled={!inStock}
                            onClick={() => handleAddToCart(item)}
                            className="bg-[#c09578] px-7 py-3 text-[12px] font-bold text-white hover:bg-[#a87c5f] disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            ADD TO CART
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </AuthRequiredPage>
  );
}
