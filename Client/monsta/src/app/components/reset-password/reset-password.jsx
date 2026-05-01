"use client";
import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ResetPassword() {

  const apiBaseUrl = process.env.NEXT_PUBLIC_APIBASEPATH;
  const router = useRouter();
  const searchParams = useSearchParams();

  const userId = searchParams.get("userId");

  const [formData, setFormData] = useState({
    new_password: "",
    confirm_password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Password match check
    if (formData.new_password !== formData.confirm_password) {
      toast.error("Passwords do not match ❌");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${apiBaseUrl}user/reset-password`, {
        userId,
        new_password: formData.new_password,
      });

      const data = res.data;

      if (data._status) {
        toast.success(data._message || "Password updated successfully ✅");

        // ✅ Auto redirect login page
        setTimeout(() => {
          router.push("/log-in");
        }, 1500);

      } else {
        toast.error(data._message || "Failed to update password ❌");
      }

    } catch (error) {
      const err = error.response?.data;

      if (err?.err) {
        Object.values(err.err).forEach((msg) => toast.error(msg));
      } else {
        toast.error("Something went wrong ❌");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f8f8f8] min-h-screen py-14">
      <div className="max-w-[1140px] mx-auto px-4">

        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold text-[#1f2937]">
            Reset Password
          </h1>
        </div>

        {/* Card */}
        <div className="max-w-[500px] mx-auto bg-white p-8 rounded-xl shadow-lg border">

          <form onSubmit={handleSubmit}>

            {/* New Password */}
            <div className="mb-5">
              <label className="text-sm font-medium text-gray-700">
                New Password *
              </label>
              <input
                type="password"
                name="new_password"
                value={formData.new_password}
                onChange={handleChange}
                placeholder="Enter new password"
                className="w-full mt-1 border border-gray-300 px-4 py-2 rounded-md text-gray-800"
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700">
                Confirm Password *
              </label>
              <input
                type="password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                placeholder="Re-enter new password"
                className="w-full mt-1 border border-gray-300 px-4 py-2 rounded-md text-gray-800"
                required
              />
            </div>

            {/* Back to Login */}
            <div className="mb-5 text-right">
              <Link
                href="/log-in"
                className="text-sm text-[#c09578] hover:underline"
              >
                Back to Login
              </Link>
            </div>

            {/* Button */}
            <button
              disabled={loading}
              className={`w-full py-2 rounded-full text-white font-medium
              ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#c09578] hover:opacity-90"}`}
            >
              {loading ? "Updating..." : "Change Password"}
            </button>

          </form>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}