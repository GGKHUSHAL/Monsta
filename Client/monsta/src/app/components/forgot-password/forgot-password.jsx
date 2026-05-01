"use client";
import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";
import Breadcrumbs from "@/app/common/Breadcrumbs";

export default function ForgotPassword() {

    const apiBaseUrl = process.env.NEXT_PUBLIC_APIBASEPATH;
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false); // ✅ loading state

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true); // ✅ start loading

        try {
            const res = await axios.post(`${apiBaseUrl}user/forgot-password`, {
                email,
            });

            const data = res.data;

            if (data._status) {
                toast.success(data._message || "Reset link sent ✅");

                setTimeout(() => {
                    setEmail("");
                    window.open("https://mail.google.com", "_blank");
                    router.push("/log-in");
                }, 2000);

            } else {
                toast.error(data._message || "Email not found ❌");
            }

        } catch (error) {
            const err = error.response?.data;

            if (err?.err) {
                Object.values(err.err).forEach((msg) => toast.error(msg));
            } else {
                toast.error("Something went wrong ❌");
            }
        } finally {
            setLoading(false); // ✅ stop loading
        }
    };

    return (
        <div className="bg-[#f8f8f8] min-h-screen py-14">
            <div className="max-w-[1140px] mx-auto px-4">

                {/* Title */}
                <Breadcrumbs tittle="Forgot Password" />


                {/* Card */}
                <div className="max-w-[500px] mx-auto bg-white p-8 rounded-xl shadow-lg border">

                    <h2 className="text-xl font-semibold text-[#111827] mb-2">
                        Reset your password
                    </h2>

                    <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                        Enter your email address and we’ll send you a link to reset your password.
                    </p>

                    <form onSubmit={handleSubmit}>

                        <div className="mb-5">
                            <label className="text-sm font-medium text-gray-700">
                                Email address *
                            </label>

                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading} // ✅ disable input
                                className="w-full mt-1 border border-gray-300 px-4 py-2 rounded-md text-gray-800 placeholder-gray-400 focus:border-[#c09578] focus:ring-1 focus:ring-[#c09578] outline-none"
                                required
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                disabled={loading}
                                className={`px-6 py-2 rounded-full text-white font-medium tracking-wide transition
                                ${loading
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-[#c09578] hover:opacity-90 cursor-pointer"
                                    }`}
                            >
                                {loading ? "Sending..." : "Send reset link"}
                            </button>

                            <Link
                                href="/log-in"
                                className="text-sm text-gray-600 hover:text-[#c09578]"
                            >
                                Back to login or Register
                            </Link>
                        </div>

                    </form>
                </div>
            </div>

            {/* Toast */}
            <ToastContainer position="top-right" autoClose={2000} />
        </div>
    );
}