"use client";

import React from "react";
import Link from "next/link";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import AuthRequiredLink from "./AuthRequiredLink";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  addToCart,
  selectCartItemByProductOptions,
  updateCartQuantity,
} from "../redux/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
  selectIsWishlisted,
} from "../redux/wishlistSlice";

export default function ProductCard({ data }) {
  const dispatch = useDispatch();
  const selectedColor = data?._productColor?.[0] || "";
  const selectedMaterial = data?._productMaterial?.[0]?._materialName || "";
  const isWishlisted = useSelector(selectIsWishlisted(data?._id));
  const cartItem = useSelector(
    selectCartItemByProductOptions(data?._id, selectedColor, selectedMaterial)
  );

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        product: data,
        selectedColor,
        selectedMaterial,
      })
    );
    toast.success("Product added to cart");
  };

  const handleAddToWishlist = () => {
    if (isWishlisted) {
      dispatch(removeFromWishlist(data?._id));
      toast.success("Product removed from wishlist");
      return;
    }

    dispatch(addToWishlist(data));
    toast.success("Product added to wishlist");
  };

  return (
    <div className="w-[280px] flex-shrink-0 bg-white shadow-lg rounded-lg overflow-hidden border">

      {/* Image */}
      <Link href={`/product/${data?.slug}`}>
        <div className="p-3 cursor-pointer">
          <img
            src={data?.imagePath || "/table.jpg"}
            alt={data?._productName}
            className="w-full h-[200px] object-contain"
          />
        </div>
      </Link>

      {/* Content */}
      <div className="text-center px-4 pb-4">

        <p className="text-sm text-gray-500">
          {data?._productParentCategory?._categoryName}
        </p>

        <Link href={`/product/${data?.slug}`}>
          <h3 className="text-xl hover:text-[#8b5e3c] cursor-pointer font-semibold text-[#4a2c2a] mt-1">
            {data?._productName}
          </h3>
        </Link>

        <div className="flex justify-center gap-3 mt-2">
          <span className="text-gray-400 line-through">
            Rs. {data?._productPrice}
          </span>

          <span className="text-lg font-bold text-[#8b5e3c]">
            Rs. {data?._productSalePrice}
          </span>
        </div>

        <div className="flex justify-center gap-3 mt-4">

          <AuthRequiredLink
            href="/wishlist"
            className="border p-2"
            message="Please login to add product to wishlist"
            label="Add to wishlist"
            onClick={handleAddToWishlist}
            navigateOnClick={false}
          >
            {isWishlisted ? (
              <FaHeart className="text-[#c09578]" />
            ) : (
              <FaRegHeart />
            )}
          </AuthRequiredLink>

          {cartItem ? (
            <div className="flex h-[42px] items-center border">
              <button
                type="button"
                onClick={() =>
                  dispatch(
                    updateCartQuantity({
                      id: cartItem.id,
                      quantity: cartItem.quantity - 1,
                    })
                  )
                }
                className="h-full px-3 text-lg hover:text-[#c09578]"
                aria-label={`Decrease quantity for ${data?._productName}`}
              >
                -
              </button>
              <span className="min-w-[34px] text-center text-sm font-semibold">
                {cartItem.quantity}
              </span>
              <button
                type="button"
                onClick={() =>
                  dispatch(
                    updateCartQuantity({
                      id: cartItem.id,
                      quantity: cartItem.quantity + 1,
                    })
                  )
                }
                className="h-full px-3 text-lg hover:text-[#c09578]"
                aria-label={`Increase quantity for ${data?._productName}`}
              >
                +
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleAddToCart}
              className="border px-4 py-2"
            >
              Add To Cart
            </button>
          )}

        </div>

      </div>
    </div>
  );
}
