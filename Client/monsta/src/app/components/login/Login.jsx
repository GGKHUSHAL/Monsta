"use client";
import Link from "next/link";
import React, { useState } from "react";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setToken } from "@/app/redux/loginSlice";


export default function AccountPage() {

  let apiBaseUrl = process.env.NEXT_PUBLIC_APIBASEPATH;
  const router = useRouter();
  const dispatch = useDispatch();

  // 🔐 Login State
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // 📝 Register State
  const [registerData, setRegisterData] = useState({
    name: "",
    phone_number: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false); // ✅ loading

  // 🔁 Handle Input
  const handleChange = (e, type) => {
    const { name, value } = e.target;

    if (type === "login") {
      setLoginData({ ...loginData, [name]: value });
    } else {
      setRegisterData({ ...registerData, [name]: value });
    }
  };

  // 🔐 LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();

    if (loading) return; // ✅ prevent double call
    setLoading(true);

    try {

      const res = await axios.post(`${apiBaseUrl}user/login`, loginData);
      const finalRes = res.data;

      if (finalRes._status) {
        dispatch(setToken(finalRes.token)); // ✅ redux

        toast.success(finalRes._message || "Login Successful ✅");

        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        toast.error(finalRes._message || "Login Failed ❌");
      }

    } catch (err) {
      toast.error("Login Failed ❌");
    } finally {
      setLoading(false);
    }
  };

  // 📝 REGISTER
  const handleRegister = async (e) => {
    e.preventDefault();

    if (loading) return;
    setLoading(true);

    try {
      const res = await axios.post(`${apiBaseUrl}user/register`, registerData);
      const finalRes = res.data;

      if (finalRes._status) {
        setRegisterData({
          name: "",
          phone_number: "",
          email: "",
          password: "",
        });

        toast.success(finalRes._message || "Registration Successful 🎉");

      } else {
        if (finalRes.err) {
          Object.values(finalRes.err).forEach((msg) => toast.error(msg));
        } else {
          toast.error("Something went wrong ❌");
        }
      }

    } catch (error) {
      const err = error.response?.data;

      if (err?.err) {
        Object.values(err.err).forEach((msg) => toast.error(msg));
      } else {
        toast.error("Server Error ❌");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f8f8f8] min-h-screen py-12 text-black font-[Poppins]">
      <div className="max-w-[1140px] mx-auto px-4">

        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#2c2c2c]">
            My Account
          </h1>
        </div>

        <div className="grid md:grid-cols-2 gap-10">

          {/* 🔐 LOGIN */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">Login</h2>

            <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md">

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={loginData.email}
                onChange={(e) => handleChange(e, "login")}
                className="w-full mb-4 border px-4 py-2 rounded"
                required
              />

              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={loginData.password}
                onChange={(e) => handleChange(e, "login")}
                className="w-full mb-4 border px-4 py-2 rounded"
                required
              />

              <div className="mb-4 text-right">
                <Link href="/forgot-password" className="text-sm text-[#c09578]">
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 rounded-full text-white
                ${loading ? "bg-gray-400" : "bg-[#c09578] hover:opacity-90"}`}
              >
                {loading ? "Logging..." : "LOGIN"}
              </button>

            </form>
          </div>

          {/* 📝 REGISTER */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">Register</h2>

            <form onSubmit={handleRegister} className="bg-white p-8 rounded-lg shadow-md">

              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={registerData.name}
                onChange={(e) => handleChange(e, "register")}
                className="w-full mb-3 border px-4 py-2 rounded"
                required
              />

              <input
                type="tel"
                name="phone_number"
                placeholder="Phone Number"
                value={registerData.phone_number}
                onChange={(e) => handleChange(e, "register")}
                className="w-full mb-3 border px-4 py-2 rounded"
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={registerData.email}
                onChange={(e) => handleChange(e, "register")}
                className="w-full mb-3 border px-4 py-2 rounded"
                required
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={registerData.password}
                onChange={(e) => handleChange(e, "register")}
                className="w-full mb-4 border px-4 py-2 rounded"
                required
              />

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 rounded-full text-white
                ${loading ? "bg-gray-400" : "bg-[#c09578] hover:opacity-90"}`}
              >
                {loading ? "Processing..." : "REGISTER"}
              </button>

            </form>
          </div>

        </div>
      </div>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}