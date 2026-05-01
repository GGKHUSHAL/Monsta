"use client";

import Breadcrumbs from "@/app/common/Breadcrumbs";
import AuthRequiredLink from "@/app/common/AuthRequiredLink";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaTrashAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  removeFromCart,
  selectCartItems,
  selectCartSubtotal,
  updateCartQuantity,
} from "@/app/redux/cartSlice";

const formatPrice = (value) => Number(value || 0).toLocaleString("en-IN");

export default function CartPage() {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);
  const discount = 0;
  const total = subtotal - discount;

  return (
    <div className="bg-white min-h-screen">
      <Breadcrumbs tittle="Shopping Cart" />

      <div className="max-w-[1140px] mx-auto px-4 pb-16">
        <div className="border-t border-[#ebebeb] pt-10"></div>

        {cartItems.length === 0 ? (
          <div className="mx-auto my-14 max-w-[420px] bg-white text-center">
            <div className="border border-[#ebebeb]">
              <div className="border-b border-[#ebebeb] px-5 py-4 text-left">
                <h2 className="text-[20px] font-semibold text-[#2d2d2d]">
                  Cart
                </h2>
              </div>

              <div className="px-8 py-10">
                <Image
                  src="/my-Order.jpg"
                  alt="Empty shopping cart"
                  width={300}
                  height={260}
                  className="mx-auto object-contain opacity-90"
                  priority
                />
              </div>

              <div className="border-t border-[#ebebeb] px-6 py-6">
                <p className="text-[14px] text-[#25364a]">
                  Your shopping cart is empty!
                </p>
                <Link
                  href="/product-listing"
                  className="mt-5 inline-block bg-[#c09578] px-6 py-3 text-sm font-bold text-white hover:bg-[#a87c5f]"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <>
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
                      Quantity
                    </th>
                    <th className="border-b border-[#c09578] px-5 py-4">
                      Total
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id}>
                      <td className="border border-[#ebebeb] px-5 py-4">
                        <button
                          type="button"
                          onClick={() => dispatch(removeFromCart(item.id))}
                          className="text-[#c09578] hover:text-[#1f1f23]"
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          <FaTrashAlt />
                        </button>
                      </td>
                      <td className="border border-[#ebebeb] px-3 py-4">
                        <Link href={`/product/${item.slug}`}>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="mx-auto h-[118px] w-[190px] object-cover"
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
                        {(item.selectedColor || item.selectedMaterial) && (
                          <p className="mt-2 text-xs text-[#777]">
                            {[item.selectedColor, item.selectedMaterial]
                              .filter(Boolean)
                              .join(" / ")}
                          </p>
                        )}
                      </td>
                      <td className="border border-[#ebebeb] px-5 py-4 font-bold">
                        Rs. {formatPrice(item.price)}
                      </td>
                      <td className="border border-[#ebebeb] px-5 py-4">
                        <div className="inline-flex items-center gap-2 font-[var(--font-playfair)] font-bold">
                          <span>Quantity</span>
                          <input
                            type="number"
                            min="1"
                            max={item.stock || 999}
                            value={item.quantity}
                            onChange={(event) =>
                              dispatch(
                                updateCartQuantity({
                                  id: item.id,
                                  quantity: event.target.value,
                                })
                              )
                            }
                            className="h-[40px] w-[60px] border border-[#ebebeb] px-3 outline-none"
                            aria-label={`Quantity for ${item.name}`}
                          />
                        </div>
                      </td>
                      <td className="border border-[#ebebeb] px-5 py-4 font-bold">
                        Rs. {formatPrice(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="6" className="px-3 py-3 text-right">
                      <button
                        type="button"
                        className="bg-[#1f1f23] px-6 py-3 text-[12px] font-bold text-white hover:bg-[#c09578]"
                      >
                        UPDATE CART
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="border border-[#ebebeb]">
                <h2 className="bg-[#1f1f23] px-4 py-4 font-[var(--font-playfair)] text-[18px] font-bold text-white">
                  COUPON
                </h2>
                <div className="p-5">
                  <p className="text-[13px] text-[#333]">
                    Enter your coupon code if you have one.
                  </p>
                  <div className="mt-6 flex flex-col gap-5 sm:flex-row">
                    <input
                      type="text"
                      placeholder="Coupon code"
                      className="h-[42px] border border-[#ebebeb] px-5 outline-none"
                    />
                    <button
                      type="button"
                      className="h-[42px] bg-[#1f1f23] px-7 text-[12px] font-bold text-white hover:bg-[#c09578]"
                    >
                      APPLY COUPON
                    </button>
                  </div>
                </div>
              </div>

              <div className="border border-[#ebebeb]">
                <h2 className="bg-[#1f1f23] px-4 py-4 font-[var(--font-playfair)] text-[18px] font-bold text-white">
                  CART TOTALS
                </h2>
                <div className="space-y-5 p-5 text-[16px] font-bold">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>Rs. {formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount (-)</span>
                    <span>Rs. {formatPrice(discount)}</span>
                  </div>
                  <div className="flex justify-between text-[18px]">
                    <span>Total</span>
                    <span>Rs. {formatPrice(total)}</span>
                  </div>
                  <div className="pt-3 text-right">
                    <AuthRequiredLink
                      href="/checkout"
                      className="inline-block bg-[#c09578] px-6 py-3 font-bold text-white hover:bg-[#a87c5f]"
                      message="Please login to checkout"
                    >
                      Proceed To Checkout
                    </AuthRequiredLink>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
