"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  FaStar,
  FaHeart,
  FaRegHeart,
  FaTruck,
  FaShieldAlt,
  FaUndo
} from "react-icons/fa";
import AuthRequiredLink from "@/app/common/AuthRequiredLink";
import {
  addToCart,
  selectCartItemByProductOptions,
  updateCartQuantity,
} from "@/app/redux/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
  selectIsWishlisted,
} from "@/app/redux/wishlistSlice";

export default function ProductDetailsClient({
  product,
}) {
  const dispatch = useDispatch();
  const isWishlisted = useSelector(selectIsWishlisted(product?._id));
  const [activeImage, setActiveImage] =
    useState(product.imagePath);

  const [selectedColor, setSelectedColor] =
    useState(
      product._productColor?.[0] || ""
    );

  const [selectedMaterial, setSelectedMaterial] =
    useState(
      product?._productMaterial?.[0]
        ?._materialName || ""
    );
  const [quantity, setQuantity] = useState(1);
  const cartItem = useSelector(
    selectCartItemByProductOptions(product?._id, selectedColor, selectedMaterial)
  );

  const [zoomStyle, setZoomStyle] =
    useState({
      opacity: 0,
      backgroundImage: `url(${product.imagePath})`,
      backgroundPosition:
        "center",
    });

  const discount =
    product._productPrice -
    product._productSalePrice;

  const handleZoom = (e) => {
    const {
      left,
      top,
      width,
      height,
    } =
      e.currentTarget.getBoundingClientRect();

    const x =
      ((e.clientX - left) /
        width) *
      100;

    const y =
      ((e.clientY - top) /
        height) *
      100;

    setZoomStyle({
      opacity: 1,
      backgroundImage: `url(${activeImage})`,
      backgroundPosition: `${x}% ${y}%`,
    });
  };

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        product,
        quantity,
        selectedColor,
        selectedMaterial,
      })
    );
    toast.success("Product added to cart");
  };

  const handleAddToWishlist = () => {
    if (isWishlisted) {
      dispatch(removeFromWishlist(product?._id));
      toast.success("Product removed from wishlist");
      return;
    }

    dispatch(addToWishlist(product));
    toast.success("Product added to wishlist");
  };

  return (
    <section className="bg-[#f8f6f3] py-12">

      <div className="max-w-[1200px] mx-auto px-4">

        <div className="grid lg:grid-cols-2 gap-12">

          {/* LEFT IMAGE */}
          <div>

            <div
              className="bg-white border rounded-sm overflow-hidden relative"
              onMouseMove={
                handleZoom
              }
              onMouseLeave={() =>
                setZoomStyle(
                  (
                    prev
                  ) => ({
                    ...prev,
                    opacity: 0,
                  })
                )
              }
            >
              <img
                src={activeImage}
                className="w-full h-[520px] object-cover"
              />

              <div
                className="absolute inset-0 pointer-events-none transition-all duration-200"
                style={{
                  opacity:
                    zoomStyle.opacity,
                  backgroundImage:
                    zoomStyle.backgroundImage,
                  backgroundPosition:
                    zoomStyle.backgroundPosition,
                  backgroundRepeat:
                    "no-repeat",
                  backgroundSize:
                    "220%",
                }}
              />
            </div>

            <div className="flex gap-4 mt-5 flex-wrap">

              <img
                src={product.imagePath}
                onClick={() =>
                  setActiveImage(
                    product.imagePath
                  )
                }
                className={`w-24 h-24 border cursor-pointer object-cover ${
                  activeImage ===
                  product.imagePath
                    ? "border-2 border-[#c09578]"
                    : ""
                }`}
              />

              {product.galleryPath?.map(
                (img, i) => (
                  <img
                    key={i}
                    src={img}
                    onClick={() =>
                      setActiveImage(
                        img
                      )
                    }
                    className={`w-24 h-24 border cursor-pointer object-cover ${
                      activeImage ===
                      img
                        ? "border-2 border-[#c09578]"
                        : ""
                    }`}
                  />
                )
              )}

            </div>

          </div>

          {/* RIGHT SIDE */}
          <div>

            <h1 className="text-[42px] leading-tight font-semibold text-[#1d1d1d]">
              {product._productName}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-4">

              <div className="flex text-[#c09578] gap-1">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </div>

              <span className="text-sm text-gray-500">
                (5 Reviews)
              </span>

            </div>

            {/* Price */}
            <div className="flex items-center gap-4 mt-5">

              <span className="text-4xl font-semibold text-[#c09578]">
                ₹
                {
                  product._productSalePrice
                }
              </span>

              <span className="line-through text-xl text-gray-400">
                ₹
                {
                  product._productPrice
                }
              </span>

              {discount > 0 && (
                <span className="bg-red-100 text-red-600 px-3 py-1 text-sm rounded-full">
                  Save ₹
                  {discount}
                </span>
              )}

            </div>

            {/* Short Desc */}
            <p className="mt-6 text-gray-600 leading-8 border-b pb-6">
              {
                product._productShortDescription
              }
            </p>

            {/* Color Select */}
            <div className="mt-6">
              <h3 className="font-semibold mb-3">
                Colors:
              </h3>

              <div className="flex gap-3 flex-wrap">

                {product._productColor?.map(
                  (
                    color,
                    i
                  ) => (
                    <button
                      key={i}
                      onClick={() =>
                        setSelectedColor(
                          color
                        )
                      }
                      className={`px-4 py-2 border rounded-full text-sm transition ${
                        selectedColor ===
                        color
                          ? "bg-[#c09578] text-white border-[#c09578]"
                          : "bg-white"
                      }`}
                    >
                      {color}
                    </button>
                  )
                )}

              </div>
            </div>

            {/* Material Select */}
            <div className="mt-6">
              <h3 className="font-semibold mb-3">
                Material:
              </h3>

              <div className="flex gap-3 flex-wrap">

                {product._productMaterial?.map(
                  (
                    item,
                    i
                  ) => (
                    <button
                      key={i}
                      onClick={() =>
                        setSelectedMaterial(
                          item._materialName
                        )
                      }
                      className={`px-4 py-2 border rounded-full text-sm transition ${
                        selectedMaterial ===
                        item._materialName
                          ? "bg-[#c09578] text-white border-[#c09578]"
                          : "bg-white"
                      }`}
                    >
                      {
                        item._materialName
                      }
                    </button>
                  )
                )}

              </div>
            </div>

            {/* Button */}
            <div className="flex flex-wrap gap-3 mt-8">
              {cartItem ? (
                <div className="flex items-center border bg-white">
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
                    className="px-5 py-4 text-xl hover:text-[#c09578]"
                    aria-label={`Decrease quantity for ${product._productName}`}
                  >
                    -
                  </button>
                  <span className="min-w-[52px] text-center font-semibold">
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
                    className="px-5 py-4 text-xl hover:text-[#c09578]"
                    aria-label={`Increase quantity for ${product._productName}`}
                  >
                    +
                  </button>
                </div>
              ) : (
                <>
                  <input
                    type="number"
                    min="1"
                    max={product._productStock || 999}
                    value={quantity}
                    onChange={(event) =>
                      setQuantity(
                        Math.max(
                          1,
                          Math.min(
                            Number(event.target.value) || 1,
                            product._productStock || 999
                          )
                        )
                      )
                    }
                    className="w-[82px] border bg-white px-4 py-4 outline-none"
                    aria-label="Product quantity"
                  />

                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="bg-[#c09578] hover:bg-[#a97d62] text-white px-12 py-4 font-medium transition"
                  >
                    Add To Cart
                  </button>
                </>
              )}

              <AuthRequiredLink
                href="/wishlist"
                className="border px-5 py-4 bg-white hover:bg-gray-50"
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

            </div>

            {/* Highlight Info */}
            <div className="mt-8 flex gap-3 flex-wrap">

              <span className="bg-[#c09578] text-white px-5 py-2 rounded-full text-sm font-medium shadow">
                {
                  product
                    ?._productParentCategory
                    ?._categoryName
                }
              </span>

              <span className="bg-[#1d1d1d] text-white px-5 py-2 rounded-full text-sm font-medium shadow">
                {
                  product
                    ?._productSubCategory
                    ?._subcategoryName
                }
              </span>

              <span className="bg-green-600 text-white px-5 py-2 rounded-full text-sm font-medium shadow">
                Stock :
                {
                  product._productStock
                }
              </span>

              <span className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium shadow capitalize">
                {
                  product._productType
                }
              </span>

            </div>

            {/* Tags */}
            <div className="flex gap-3 flex-wrap mt-8">

              {product._bestSelling && (
                <span className="bg-orange-100 text-orange-700 px-4 py-2 text-sm rounded-full">
                  Best Selling
                </span>
              )}

              {product._topRated && (
                <span className="bg-yellow-100 text-yellow-700 px-4 py-2 text-sm rounded-full">
                  Top Rated
                </span>
              )}

              {product._upsell && (
                <span className="bg-blue-100 text-blue-700 px-4 py-2 text-sm rounded-full">
                  Recommended
                </span>
              )}

            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 mt-10">

              <div className="bg-white border p-4 text-center">
                <FaTruck className="mx-auto text-[#c09578] text-xl mb-2" />
                <p className="text-sm">
                  Fast Delivery
                </p>
              </div>

              <div className="bg-white border p-4 text-center">
                <FaShieldAlt className="mx-auto text-[#c09578] text-xl mb-2" />
                <p className="text-sm">
                  Secure Payment
                </p>
              </div>

              <div className="bg-white border p-4 text-center">
                <FaUndo className="mx-auto text-[#c09578] text-xl mb-2" />
                <p className="text-sm">
                  Easy Return
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* Description */}
        <div className="bg-white border mt-16 p-8">

          <h2 className="text-3xl font-semibold text-[#1d1d1d] mb-5">
            Description
          </h2>

          <p className="text-gray-700 leading-9">
            {
              product._productDescription
            }
          </p>

        </div>

      </div>

    </section>
  );
}
