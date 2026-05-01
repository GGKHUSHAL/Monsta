"use client"
import { IoIosSearch } from "react-icons/io";
import { FaHeart } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import { IoMdCart } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import React, { useEffect, useRef, useState } from 'react'
import Link from "next/link";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../redux/loginSlice";
import { useRouter } from "next/navigation";
import AuthRequiredLink from "./AuthRequiredLink";
import {
    removeFromCart,
    selectCartCount,
    selectCartItems,
    selectCartSubtotal
} from "../redux/cartSlice";
import { selectWishlistCount } from "../redux/wishlistSlice";

const getCategoryHref = (type, item) => {
    let slug = item?.slug || item?._id;

    return slug ? `/${type}/${encodeURIComponent(slug)}` : "/";
};

export default function Header({ companyProfile, categories = [] }) {
    let token = useSelector((state) => state.authStore.token);
    const cartItems = useSelector(selectCartItems);
    const cartCount = useSelector(selectCartCount);
    const cartSubtotal = useSelector(selectCartSubtotal);
    const wishlistCount = useSelector(selectWishlistCount);
    let dispatch = useDispatch();
    const router = useRouter();
    const companyPhone =
        companyProfile?.company_phone_number ||
        "+91-98745612330";
    const companyEmail =
        companyProfile?.company_email ||
        "furnitureinfo@gmail.com";
    const closeTimerRef = useRef(null);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isCartMounted, setIsCartMounted] = useState(false);
    const formattedCartSubtotal = cartSubtotal.toLocaleString("en-IN");

    const openCart = () => {
        if (closeTimerRef.current) {
            clearTimeout(closeTimerRef.current);
        }

        setIsCartMounted(true);
        setTimeout(() => setIsCartOpen(true), 10);
    };

    const closeCart = () => {
        setIsCartOpen(false);
        closeTimerRef.current = setTimeout(() => {
            setIsCartMounted(false);
        }, 300);
    };

    useEffect(() => {
        document.body.style.overflow = isCartMounted ? "hidden" : "";

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                closeCart();
            }
        };

        window.addEventListener("keydown", handleEscape);

        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", handleEscape);
            if (closeTimerRef.current) {
                clearTimeout(closeTimerRef.current);
            }
        };
    }, [isCartMounted]);

    return (
        <>
            <div className='Container bg-[#FFFFFF] py-1 border-b' >
                <div className='Container w-[1140px] py-2  mx-auto bg-[#FFFFFF] tracking-wide flex justify-between text-[12px] text-[#212121]'>
                    <p>Contact us 24/7 : {companyPhone} / {companyEmail}</p>
                    <p className="cursor-pointer hover:text-[#C09578]">
                        {
                            token ? (
                                <>
                                    <button
                                        onClick={() => {
                                            dispatch(logOut());
                                            router.push("/log-in");
                                        }}
                                        className="px-5 py-2 cursor-pointer bg-[#c09578] text-white rounded-full text-sm font-medium hover:bg-[#a87c5f] transition"
                                    >
                                        Logout
                                    </button>

                                    <Link
                                        href="/my-dashboard"
                                        className="px-5 py-2 cursor-pointer border border-[#c09578] text-[#c09578] rounded-full text-sm font-medium hover:bg-[#c09578] hover:text-white transition ml-2"
                                    >
                                        My Dashboard
                                    </Link>
                                </>
                            ) : (
                                <Link
                                    href="/log-in"
                                    className="px-5 py-2 cursor-pointer border border-[#c09578] text-[#c09578] rounded-full text-sm font-medium hover:bg-[#c09578] hover:text-white transition"
                                >
                                    Login / Register
                                </Link>
                            )
                        }
                    </p>
                </div>

            </div>
            <div className='Container bg-[#FFFFFF] py-1 border-b' >
                <div className='Container w-[1140px] py-2 mx-auto bg-[#FFFFFF] tracking-wide flex justify-between'>
                    <div>
                        <img className='w-[126px] cursor-pointer'
                            src='https://wscubetech.co/Assignments/furniture/storage/app/public/uploads/images/company-profile/logo/cccfbdab-3bec-439f-88b9-5694698cd302-1670132652.png'
                            alt='Monsta-Logo'
                        />
                    </div>
                    <div className='w-auto flex gap-4'>
                        <div className='text-[#a4a4a4] border flex gap-[80px] p-2 justify-between items-center'>
                            <input className='text-[#a4a4a4] p-1 text-[12px] outline-none' type="search" placeholder='Search Product...' /><IoIosSearch className="text-[18px] hover:text-[#C09578] cursor-pointer text-black" />
                        </div>
                        <AuthRequiredLink
                            href="/wishlist"
                            className="relative border border-[#a4a4a4] p-2 text-black text-[22px] hover:text-[#C09578] cursor-pointer"
                            label="Open wishlist"
                            message="Please login to view wishlist"
                        >
                            <FaHeart />
                            {wishlistCount > 0 && (
                                <span className="absolute right-[-10px] top-[-10px] bg-[#C09578] text-white text-[12px] leading-none p-[5px] rounded-full">
                                    {wishlistCount}
                                </span>
                            )}
                        </AuthRequiredLink>
                        <button
                            type="button"
                            onClick={openCart}
                            className="relative border border-[#a4a4a4] p-2 flex gap-2 items-center text-black font-bold hover:text-[#C09578] cursor-pointer"
                            aria-label="Open shopping cart"
                            aria-expanded={isCartOpen}
                        >
                            <IoMdCart className="text-[22px] border-e pe-1 border-[#a4a4a4]" />
                            <p>Rs. {formattedCartSubtotal}</p>
                            <FaChevronDown />
                            <span className="absolute left-[-10px] bg-[#C09578] text-white p-[2px] px-1 rounded-2xl">{cartCount}</span>
                        </button>
                    </div>
                </div>
            </div>
            <div className='Container bg-[#FFFFFF] pt-5 border-b' >
                <ul className="w-[1140px] mx-auto flex justify-center gap-5 font-bold  text-[13px]">
                    <li className="text-[#C09578] pb-5 cursor-pointer"><Link href={"/"}>Home</Link></li>
                    {categories.map((category) => {
                        const subcategories = category?.subcategories || [];

                        return (
                            <li
                                key={category._id}
                                className="group/parent [&:has(.child:hover)_span]:text-[#C09578] flex items-center gap-2 text-[#5a5a5a] relative pb-5"
                            >
                                <Link
                                    href={getCategoryHref("category", category)}
                                    className="flex items-center gap-2 cursor-pointer uppercase"
                                >
                                    <span>
                                        {category._categoryName}
                                    </span>
                                    {subcategories.length > 0 && <FaChevronDown />}
                                </Link>

                                {subcategories.length > 0 && (
                                    <div className="origin-top-left child group-hover/parent:rotate-x-[0deg] rotate-x-[-90deg] duration-[0.5s] grid grid-cols-3 absolute z-999 top-[41px] left-[-20px] w-[720px] gap-8 p-5 bg-[#FFFF] shadow-lg text-left">
                                        {subcategories.map((subcategory) => {
                                            const subsubcategories =
                                                subcategory?.subSubcategories || [];

                                            return (
                                                <div key={subcategory._id}>
                                                    <Link
                                                        href={getCategoryHref("subcategory", subcategory)}
                                                        className="block text-black font-black uppercase mb-4 hover:text-[#C09578]"
                                                    >
                                                        {subcategory._subcategoryName}
                                                    </Link>

                                                    {subsubcategories.length > 0 && (
                                                        <ul className="leading-[30px] font-normal">
                                                            {subsubcategories.map((subsubcategory) => (
                                                                <li
                                                                    key={subsubcategory._id}
                                                                    className="hover:text-[#C09578]"
                                                                >
                                                                    <Link
                                                                        href={getCategoryHref(
                                                                            "subsubcategory",
                                                                            subsubcategory
                                                                        )}
                                                                    >
                                                                        {subsubcategory._subsubcategoryName}
                                                                    </Link>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </li>
                        );
                    })}
                    <li className="group/parent [&:has(.child:hover)_span]:text-[#C09578] relative text-black">
                        <span className="hover:text-[#C09578] flex gap-2 items-center pb-5 cursor-pointer">
                            PAGES <FaChevronDown />
                        </span>
                        <div className="origin-top-left child group-hover/parent:rotate-x-[0deg]  rotate-x-[-90deg] duration-[0.5s] flex absolute z-999 top-[41px] left-[-20px] w-[200px] gap-[50px] p-5 bg-[#FFFF]">

                            <ul className="leading-[30px]">
                                <li className="hover:text-[#C09578]">
                                    <a href="/about-us">About Us</a>
                                </li>
                                <li className="hover:text-[#C09578]">
                                    <Link href="/cart">Cart</Link>
                                </li>
                                <li className="hover:text-[#C09578]">
                                    <AuthRequiredLink
                                        href="/wishlist"
                                        message="Please login to view wishlist"
                                    >
                                        Wishlist
                                    </AuthRequiredLink>
                                </li>
                                <li className="hover:text-[#C09578]">
                                    <Link href="/privacy-policy">Privacy Policy</Link>
                                </li>
                                <li className="hover:text-[#C09578]">
                                    <Link href="/term-of-use">Term Of Use</Link>
                                </li>
                                <li className="hover:text-[#C09578]">
                                    <AuthRequiredLink
                                        href="/checkout"
                                        message="Please login to checkout"
                                    >
                                        Checkout
                                    </AuthRequiredLink>
                                </li>
                                <li className="hover:text-[#C09578]">
                                    <Link href="/frequently-questions">Frequently Questions</Link>
                                </li>
                            </ul>

                        </div>

                    </li>
                    <li className="text-black hover:text-[#C09578] pb-5 cursor-pointer"><Link href={"/contact-us"}>CONTACT US</Link></li>
                </ul>
            </div>

            {isCartMounted && (
                <div
                    className={`fixed inset-0 z-[9999] bg-black/35 transition-opacity duration-300 ease-out ${isCartOpen ? "opacity-100" : "opacity-0"}`}
                    onClick={closeCart}
                >
                    <aside
                        className={`ml-auto h-full w-full max-w-[365px] bg-white shadow-2xl transition-transform duration-300 ease-out ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b border-[#ebebeb] px-5 py-4">
                            <h2 className="text-[20px] font-semibold text-[#2d2d2d]">Cart</h2>
                            <button
                                type="button"
                                onClick={closeCart}
                                className="text-[28px] text-[#2d2d2d] hover:text-[#C09578] cursor-pointer"
                                aria-label="Close shopping cart"
                            >
                                <IoClose />
                            </button>
                        </div>

                        {cartItems.length > 0 ? (
                            <div className="flex h-[calc(100%-62px)] flex-col">
                                <div className="flex-1 overflow-y-auto px-5">
                                    {cartItems.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex gap-3 border-b border-[#ebebeb] py-5"
                                        >
                                            <Link
                                                href={`/product/${item.slug}`}
                                                onClick={closeCart}
                                                className="h-[60px] w-[96px] flex-shrink-0 overflow-hidden border border-[#eeeeee]"
                                            >
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            </Link>

                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-start justify-between gap-2">
                                                    <Link
                                                        href={`/product/${item.slug}`}
                                                        onClick={closeCart}
                                                        className="font-[var(--font-playfair)] text-[16px] font-semibold text-[#2d2d2d] hover:text-[#C09578]"
                                                    >
                                                        {item.name}
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => dispatch(removeFromCart(item.id))}
                                                        className="text-[22px] text-black hover:text-[#C09578]"
                                                        aria-label={`Remove ${item.name} from cart`}
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                                <p className="mt-1 text-[14px] text-[#25364a]">
                                                    Qty: {item.quantity}
                                                </p>
                                                <p className="mt-1 text-[14px] font-bold text-[#C09578]">
                                                    Rs. {Number(item.price).toLocaleString("en-IN")}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-[#ebebeb] p-5">
                                    <div className="mb-5 flex justify-between text-[15px] font-semibold">
                                        <span>Subtotal:</span>
                                        <span>Rs. {formattedCartSubtotal}</span>
                                    </div>
                                    <div className="bg-[#1f1f1f] p-4">
                                        <Link
                                            href="/cart"
                                            onClick={closeCart}
                                            className="block bg-[#2d2d2d] px-5 py-3 text-center text-[13px] font-bold text-white hover:bg-[#C09578]"
                                        >
                                            VIEW CART
                                        </Link>
                                        <AuthRequiredLink
                                            href="/checkout"
                                            onClick={closeCart}
                                            className="mt-4 block bg-[#C09578] px-5 py-3 text-center text-[13px] font-bold text-white hover:bg-[#a87c5f]"
                                            message="Please login to checkout"
                                        >
                                            CHECKOUT
                                        </AuthRequiredLink>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex h-[calc(100%-62px)] flex-col">
                                <div className="flex flex-1 items-center justify-center px-8 py-10">
                                    <Image
                                        src="/my-Order.jpg"
                                        alt="Empty shopping cart"
                                        width={300}
                                        height={260}
                                        className="h-auto w-full object-contain opacity-90"
                                    />
                                </div>

                                <div className="border-y border-[#ebebeb] px-6 py-6 text-center">
                                    <p className="text-[14px] text-[#25364a]">
                                        Your shopping cart is empty!
                                    </p>
                                    <Link
                                        href="/product-listing"
                                        onClick={closeCart}
                                        className="mt-5 inline-block bg-[#C09578] px-6 py-3 text-[13px] font-bold text-white hover:bg-[#a87c5f]"
                                    >
                                        CONTINUE SHOPPING
                                    </Link>
                                </div>
                            </div>
                        )}
                    </aside>
                </div>
            )}
        </>
    )
}
