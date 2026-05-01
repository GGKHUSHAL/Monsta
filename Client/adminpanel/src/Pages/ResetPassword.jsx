"use client";
import React, { useState } from "react";
import axios from "axios";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

export default function ResetPassword() {
  const apiBaseUrl = import.meta.env.VITE_APIBASEURL;

  const queryParams = new URLSearchParams(window.location.search);
  const userId = queryParams.get("userId");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!userId) {
      iziToast.error({
        title: "Error",
        message: "Invalid Reset Link",
        position: "topRight"
      });
      return;
    }

    if (!newPassword || !confirmPassword) {
      iziToast.warning({
        title: "Warning",
        message: "All fields are required",
        position: "topRight"
      });
      return;
    }

    if (newPassword.length < 6) {
      iziToast.warning({
        title: "Warning",
        message: "Password must be minimum 6 characters",
        position: "topRight"
      });
      return;
    }

    if (newPassword.length > 20) {
      iziToast.warning({
        title: "Warning",
        message: "Password maximum 20 characters only",
        position: "topRight"
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      iziToast.warning({
        title: "Warning",
        message: "Password and Confirm Password not matched",
        position: "topRight"
      });
      return;
    }

    try {
      setLoading(true);

      let res = await axios.post(`${apiBaseUrl}admin/reset-password`, {
        userId,
        new_password: newPassword
      });

      if (res.data._status) {
        iziToast.success({
          title: "Success",
          message: res.data._message,
          position: "topRight"
        });

        setTimeout(() => {
          window.location.href = "/log-in";
        }, 1500);
      } else {
        iziToast.error({
          title: "Error",
          message: res.data._message,
          position: "topRight"
        });
      }
    } catch (error) {
      iziToast.error({
        title: "Error",
        message: "Something went wrong",
        position: "topRight"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-4">
      <div className="w-full max-w-md backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-8">
        <div className="flex justify-center mb-5">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3064/3064197.png"
            className="w-16 h-16 rounded-full bg-white p-2"
            alt="reset"
          />
        </div>

        <h2 className="text-2xl font-bold text-center text-white mb-6">
          Reset Password
        </h2>

        <form onSubmit={handleResetPassword} className="space-y-4">
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white outline-none focus:ring-2 focus:ring-white"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white outline-none focus:ring-2 focus:ring-white"
          />

          <button
            disabled={loading}
            className="w-full py-3 rounded-lg bg-white text-purple-600 font-semibold hover:bg-gray-100 transition duration-300 shadow-md disabled:opacity-70"
          >
            {loading ? "Please Wait..." : "Reset Password"}
          </button>
        </form>

        <button
          onClick={() => (window.location.href = "/log-in")}
          className="w-full mt-4 text-white text-sm hover:underline"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}