"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { subscribeNewsletter } from "@/app/services/homeServices";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    setIsSubmitting(true);

    let finalRes = await subscribeNewsletter(email);

    setIsSubmitting(false);

    if (finalRes?._status) {
      toast.success(finalRes?._message || "Newsletter subscribed successfully");
      setEmail("");
      return;
    }

    toast.error(finalRes?._message || "Please enter a valid email address");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row items-center justify-center gap-3"
    >
      <input
        type="email"
        placeholder="Email address..."
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full sm:w-[60%] px-4 py-3 placeholder-gray-600 border rounded outline-none"
      />

      <button
        disabled={isSubmitting}
        className="bg-[#c89a7b] cursor-pointer text-white px-8 py-3 rounded font-semibold hover:opacity-90 transition disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Subscribing..." : "Subscribe"}
      </button>
    </form>
  );
}
