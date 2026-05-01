"use client";
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import {
  FaCloudUploadAlt,
  FaBars,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaLinkedinIn,
  FaTelegramPlane,
  FaUserCircle,
  FaArrowLeft
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function CompanyProfile() {
  const apiBaseUrl = import.meta.env.VITE_APIBASEURL;
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    company_name: "",
    company_email: "",
    company_phone_number: "",
    company_address: "",
    company_map_location: "",
    company_facebook_link: "",
    company_instagram_link: "",
    company_twitter_link: "",
    company_youtube_link: "",
    company_linkedin_link: "",
    company_telegram_link: ""
  });

  // GET DATA
  const getCompanyData = useCallback(async () => {
    try {
      let res = await axios.post(
        `${apiBaseUrl}admin/get-data`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (res.data._status) {
        let data = res.data.userData;

        setFormData({
          company_name: data.company_name || "",
          company_email: data.company_email || "",
          company_phone_number: data.company_phone_number || "",
          company_address: data.company_address || "",
          company_map_location: data.company_map_location || "",
          company_facebook_link: data.company_facebook_link || "",
          company_instagram_link: data.company_instagram_link || "",
          company_twitter_link: data.company_twitter_link || "",
          company_youtube_link: data.company_youtube_link || "",
          company_linkedin_link: data.company_linkedin_link || "",
          company_telegram_link: data.company_telegram_link || ""
        });

        if (data.company_logo) {
          setImage(res.data.path + data.company_logo);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [apiBaseUrl, token]);

  useEffect(() => {
    getCompanyData();
  }, [getCompanyData]);

  // INPUT CHANGE
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // IMAGE CHANGE
  const handleImage = (e) => {
    let file = e.target.files[0];

    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  // MAP FIX
  const getMapUrl = (input) => {
    if (!input) return "";

    let url = input.trim();

    // if full iframe pasted then extract src
    const match = url.match(/src=["']([^"']+)["']/i);
    if (match && match[1]) {
      return match[1];
    }

    // already embed link
    if (
      url.includes("/maps/embed") ||
      url.includes("output=embed") ||
      url.includes("google.com/maps/embed")
    ) {
      return url;
    }

    // normal link convert
    return `https://www.google.com/maps?q=${encodeURIComponent(
      url
    )}&output=embed`;
  };

  // UPDATE
  const updateCompanyProfile = async (e) => {
    e.preventDefault();

    let sendData = new FormData();

    sendData.append("company_name", formData.company_name);
    sendData.append("company_email", formData.company_email);
    sendData.append("company_phone_number", formData.company_phone_number);
    sendData.append("company_address", formData.company_address);
    sendData.append("company_map_location", formData.company_map_location);
    sendData.append("company_facebook_link", formData.company_facebook_link);
    sendData.append("company_instagram_link", formData.company_instagram_link);
    sendData.append("company_twitter_link", formData.company_twitter_link);
    sendData.append("company_youtube_link", formData.company_youtube_link);
    sendData.append("company_linkedin_link", formData.company_linkedin_link);
    sendData.append("company_telegram_link", formData.company_telegram_link);

    if (e.target.company_logo.files[0]) {
      sendData.append(
        "profileImage",
        e.target.company_logo.files[0]
      );
    }

    try {
      setLoading(true);

      let res = await axios.post(
        `${apiBaseUrl}admin/update-profile`,
        sendData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      if (res.data._status) {
        iziToast.success({
          title: "Success",
          message: "Company Profile Updated Successfully",
          position: "topRight"
        });

        getCompanyData();
      } else {
        iziToast.error({
          title: "Error",
          message: res.data._message,
          position: "topRight"
        });
      }
    } catch {
      iziToast.error({
        title: "Error",
        message: "Update failed",
        position: "topRight"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f4f6f9] min-h-screen">
      {/* Header */}
      <div className="bg-white h-[60px] shadow-sm flex justify-between items-center px-6">
        <div className="flex items-center gap-4 text-gray-600">
          <FaBars />
          <span className="font-medium">Dashboard</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="bg-[#6f42c1] hover:bg-[#5b36a3] text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
          >
            <FaArrowLeft />
            Back to Dashboard
          </button>

          <FaUserCircle className="text-3xl text-gray-500" />
        </div>
      </div>

      {/* Body */}
      <div className="p-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h1 className="text-xl font-semibold text-gray-700">
            Company Profile
          </h1>

          <p className="text-sm text-blue-500 mt-1">
            Dashboard / Company Profile
          </p>

          <form
            onSubmit={updateCompanyProfile}
            className="mt-6 space-y-5"
          >
            {/* Top */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Logo */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Company Logo
                </p>

                <label className="border border-dashed border-gray-300 h-[220px] rounded-lg flex flex-col justify-center items-center cursor-pointer overflow-hidden bg-gray-50 hover:bg-gray-100">
                  {image ? (
                    <img
                      src={image}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      <FaCloudUploadAlt className="text-5xl text-gray-300" />
                      <p className="text-gray-400 mt-2">
                        Upload Company Logo
                      </p>
                    </>
                  )}

                  <input
                    type="file"
                    hidden
                    name="company_logo"
                    accept="image/*"
                    onChange={handleImage}
                  />
                </label>
              </div>

              {/* Inputs */}
              <div className="space-y-4">
                <input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  placeholder="Company Name"
                  className="w-full border rounded-lg px-4 py-2"
                />

                <input
                  type="email"
                  name="company_email"
                  value={formData.company_email}
                  onChange={handleChange}
                  placeholder="Company Email"
                  className="w-full border rounded-lg px-4 py-2"
                />

                <input
                  type="text"
                  name="company_phone_number"
                  value={formData.company_phone_number}
                  onChange={handleChange}
                  placeholder="Company Phone Number"
                  className="w-full border rounded-lg px-4 py-2"
                />
              </div>
            </div>

            {/* Address */}
            <textarea
              rows="3"
              name="company_address"
              value={formData.company_address}
              onChange={handleChange}
              placeholder="Company Address"
              className="w-full border rounded-lg px-4 py-3"
            ></textarea>

            {/* Map Link */}
            <textarea
              rows="3"
              name="company_map_location"
              value={formData.company_map_location}
              onChange={handleChange}
              placeholder="Paste Google Map Link / Embed Code / Place Name"
              className="w-full border rounded-lg px-4 py-3"
            ></textarea>

            {/* Social */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="relative">
                <FaFacebookF className="absolute top-4 left-3 text-blue-600" />
                <input
                  type="text"
                  name="company_facebook_link"
                  value={formData.company_facebook_link}
                  onChange={handleChange}
                  placeholder="Facebook Link"
                  className="w-full border rounded-lg pl-10 pr-4 py-2"
                />
              </div>

              <div className="relative">
                <FaInstagram className="absolute top-4 left-3 text-pink-500" />
                <input
                  type="text"
                  name="company_instagram_link"
                  value={formData.company_instagram_link}
                  onChange={handleChange}
                  placeholder="Instagram Link"
                  className="w-full border rounded-lg pl-10 pr-4 py-2"
                />
              </div>

              <div className="relative">
                <FaTwitter className="absolute top-4 left-3 text-sky-500" />
                <input
                  type="text"
                  name="company_twitter_link"
                  value={formData.company_twitter_link}
                  onChange={handleChange}
                  placeholder="Twitter Link"
                  className="w-full border rounded-lg pl-10 pr-4 py-2"
                />
              </div>

              <div className="relative">
                <FaYoutube className="absolute top-4 left-3 text-red-600" />
                <input
                  type="text"
                  name="company_youtube_link"
                  value={formData.company_youtube_link}
                  onChange={handleChange}
                  placeholder="YouTube Link"
                  className="w-full border rounded-lg pl-10 pr-4 py-2"
                />
              </div>

              <div className="relative">
                <FaLinkedinIn className="absolute top-4 left-3 text-blue-700" />
                <input
                  type="text"
                  name="company_linkedin_link"
                  value={formData.company_linkedin_link}
                  onChange={handleChange}
                  placeholder="LinkedIn Link"
                  className="w-full border rounded-lg pl-10 pr-4 py-2"
                />
              </div>

              <div className="relative">
                <FaTelegramPlane className="absolute top-4 left-3 text-sky-500" />
                <input
                  type="text"
                  name="company_telegram_link"
                  value={formData.company_telegram_link}
                  onChange={handleChange}
                  placeholder="Telegram Link"
                  className="w-full border rounded-lg pl-10 pr-4 py-2"
                />
              </div>
            </div>

            {/* Real Map */}
            {formData.company_map_location && (
              <div className="rounded-xl overflow-hidden border">
                <div className="bg-gray-100 px-4 py-2 font-medium text-gray-700">
                  Company Location Map
                </div>

                <iframe
                  title="map"
                  src={getMapUrl(formData.company_map_location)}
                  className="w-full h-[350px]"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            )}

            {/* Button */}
            <button
              disabled={loading}
              className="bg-[#6f42c1] hover:bg-[#5b36a3] text-white px-8 py-2 rounded-lg"
            >
              {loading
                ? "Please Wait..."
                : "Update Company Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
