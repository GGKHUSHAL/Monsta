import Link from "next/link";
import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn, FaYoutube, FaTelegramPlane } from "react-icons/fa";
import TopRatedProducts from "./TopRatedProducts";
import AuthRequiredLink from "./AuthRequiredLink";

export default function Footer({ companyProfile }) {
  const companyAddress =
    companyProfile?.company_address ||
    "Claritas est etiam processus dynamicus";
  const companyPhone =
    companyProfile?.company_phone_number ||
    "98745612330";
  const companyEmail =
    companyProfile?.company_email ||
    "furnitureinfo@gmail.com";

  const socialLinks = [
    {
      href: companyProfile?.company_facebook_link,
      label: "Facebook",
      icon: <FaFacebookF />
    },
    {
      href: companyProfile?.company_instagram_link,
      label: "Instagram",
      icon: <FaInstagram />
    },
    {
      href: companyProfile?.company_twitter_link,
      label: "Twitter",
      icon: <FaTwitter />
    },
    {
      href: companyProfile?.company_linkedin_link,
      label: "LinkedIn",
      icon: <FaLinkedinIn />
    },
    {
      href: companyProfile?.company_youtube_link,
      label: "YouTube",
      icon: <FaYoutube />
    },
    {
      href: companyProfile?.company_telegram_link,
      label: "Telegram",
      icon: <FaTelegramPlane />
    }
  ];

  return (
    <footer className="bg-white border-t">

      {/* Main Footer Section */}
      <div className="container mx-auto w-[1140px] py-12 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Contact Us */}
        <div>
          <h3 className="text-[20px] text-black font-semibold mb-6">Contact Us</h3>

          <p className="text-[14px] text-gray-600 mb-3">
            Address: {companyAddress}
          </p>

          <p className="text-[14px] text-gray-600 mb-3">
            Phone: {companyPhone}
          </p>

          <p className="text-[14px] text-gray-600 mb-6">
            Email: {companyEmail}
          </p>

          <div className="flex space-x-3">
            {socialLinks.map((item) => (
              item.href ? (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={item.label}
                  className="border p-2 rounded-full text-gray-400 hover:text-black cursor-pointer"
                >
                  {item.icon}
                </a>
              ) : null
            ))}
          </div>
        </div>

        {/* Information */}
        <div>
          <h3 className="text-[20px] text-black font-semibold mb-6">Information</h3>
          <ul className="space-y-3 text-[14px] text-gray-600">
            <li className="hover:text-black cursor-pointer"><Link href={"/about-us"}>About Us</Link></li>
            <li className="hover:text-black cursor-pointer"><Link href={"/contact-us"}>Contact Us</Link></li>
            <li className="hover:text-black cursor-pointer"><Link href={"/frequently-questions"}>Frequently Questions</Link></li>
          </ul>
        </div>

        {/* My Account */}
        <div>
          <h3 className="text-[20px] text-black font-semibold mb-6">My Account</h3>
          <ul className="space-y-3 text-[14px] text-gray-600">
            <li className="hover:text-black cursor-pointer"><Link href={"/my-dashboard"}>My Dashboard</Link></li>
            <li className="hover:text-black cursor-pointer">
              <AuthRequiredLink href="/wishlist" message="Please login to view wishlist">
                Wishlist
              </AuthRequiredLink>
            </li>
            <li className="hover:text-black cursor-pointer"><Link href={"/cart"}>Cart</Link></li>
            <li className="hover:text-black cursor-pointer">
              <AuthRequiredLink href="/checkout" message="Please login to checkout">
                Checkout
              </AuthRequiredLink>
            </li>
          </ul>
        </div>

        {/* Top Rated Products */}
        <TopRatedProducts />
      </div>

      {/* Bottom Links */}
      <div className="border-t">
        <div className="container mx-auto w-[1140px] py-6 flex justify-center space-x-10 text-[14px] text-gray-600">
          <span className="hover:text-black cursor-pointer">Home</span>
          <span className="hover:text-black cursor-pointer">Online Store</span>
          <Link href="/privacy-policy" className="hover:text-black cursor-pointer">Privacy Policy</Link>
          <Link href="/term-of-use" className="hover:text-black cursor-pointer">Terms Of Use</Link>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-[14px] text-gray-600 py-4">
        All Rights Reserved By Furniture | © 2026
      </div>

      {/* Payment Methods */}
      <div className="flex justify-center pb-6 space-x-4">
        <img
          src="papyel2.png"
          className="h-6"
          alt="Payment-Partners"
        />
      </div>
    </footer>
  );
}
