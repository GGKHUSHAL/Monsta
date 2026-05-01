"use client";
import React, { useState } from "react";
import axios from "axios";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [showForgot, setShowForgot] = useState(false);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  const apiBaseUrl = import.meta.env.VITE_APIBASEURL;

  const validate = () => {
    let err = {};

    if (!email.trim()) {
      err.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)
    ) {
      err.email = "Invalid email address";
    }

    if (!password.trim()) {
      err.password = "Password is required";
    } else if (password.length < 6) {
      err.password = "Password must be at least 6 characters";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      let res = await axios.post(`${apiBaseUrl}admin/login`, {
        email,
        password
      });

      if (res.data._status) {
        iziToast.success({
          title: "Success",
          message: "Login Successful!",
          position: "topRight"
        });

        localStorage.setItem("token", res.data.token);

        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      } else {
        iziToast.error({
          title: "Error",
          message: res.data._message || "Invalid Credentials",
          position: "topRight"
        });
      }
    } catch (error) {
      iziToast.error({
        title: "Error",
        message: "Login failed. Please try again.",
        position: "topRight"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!forgotEmail.trim()) {
      iziToast.warning({
        title: "Warning",
        message: "Please enter email",
        position: "topRight"
      });
      return;
    }

    try {
      setForgotLoading(true);

      let res = await axios.post(`${apiBaseUrl}admin/forgot-password`, {
        email: forgotEmail
      });

      if (res.data._status) {
        iziToast.success({
          title: "Success",
          message: res.data._message,
          position: "topRight"
        });

        setShowForgot(false);
        setForgotEmail("");
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
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-8 w-[380px]">
        <div className="flex justify-center mb-6">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            className="w-16 h-16 rounded-full border-2 border-white shadow-lg"
            alt="Admin"
          />
        </div>

        <h2 className="text-2xl font-bold text-center text-white mb-6">
          {showForgot ? "Forgot Password" : "Admin Login"}
        </h2>

        {!showForgot ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors({ ...errors, email: "" });
                }}
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white outline-none focus:ring-2 focus:ring-white"
              />
              {errors.email && (
                <p className="text-red-200 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors({ ...errors, password: "" });
                }}
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white outline-none focus:ring-2 focus:ring-white"
              />
              {errors.password && (
                <p className="text-red-200 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div className="text-right">
              <button
                type="button"
                onClick={() => setShowForgot(true)}
                className="text-white text-sm hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <button
              disabled={loading}
              className="w-full py-2 rounded-lg bg-white text-purple-600 font-semibold hover:bg-gray-100 transition duration-300 shadow-md hover:scale-105 disabled:opacity-70"
            >
              {loading ? "Please Wait..." : "Login"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <input
              type="email"
              placeholder="Enter Registered Email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white outline-none focus:ring-2 focus:ring-white"
            />

            <button
              disabled={forgotLoading}
              className="w-full py-2 rounded-lg bg-white text-purple-600 font-semibold hover:bg-gray-100 transition duration-300 shadow-md"
            >
              {forgotLoading ? "Please Wait..." : "Send Reset Link"}
            </button>

            <button
              type="button"
              onClick={() => setShowForgot(false)}
              className="w-full text-white text-sm hover:underline"
            >
              Back to Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}