"use client";
import React, { useState } from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { submitContactQuery } from "../../services/homeServices";

export default function ContactFormSection({ companyProfile }) {
  const companyAddress =
    companyProfile?.company_address ||
    "Claritas est etiam processus dynamicus";
  const companyPhone =
    companyProfile?.company_phone_number ||
    "98745612330";
  const companyEmail =
    companyProfile?.company_email ||
    "furnitureinfo@gmail.com";

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let err = {};

    if (!form.name) err.name = "Name is required and cannot be empty";
    if (!form.email) err.email = "Email address is required and cannot be empty";
    if (!form.mobile) err.mobile = "Mobile Number is required and cannot be empty";
    if (!form.subject) err.subject = "Subject is required and cannot be empty";
    if (!form.message) err.message = "Message is required and cannot be empty";

    setErrors(err);

    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    let finalRes = await submitContactQuery(form);

    setIsSubmitting(false);

    if (finalRes?._status) {
      toast.success(finalRes?._message || "Query submitted successfully");
      setForm({
        name: "",
        email: "",
        mobile: "",
        subject: "",
        message: "",
      });
      setErrors({});
      return;
    }

    if (finalRes?.err) {
      setErrors(finalRes.err);
    }

    toast.error(finalRes?._message || "Please check your form details");
  };

  return (
    <div className="w-full py-16 bg-gray-50">
      <div className="w-[95%] max-w-[1200px] mx-auto grid md:grid-cols-2 gap-12">

        {/* LEFT CONTACT INFO */}
        <div>
          <h2 className="text-3xl font-bold text-black mb-6">
            Contact Us
          </h2>

          <div className="border-b py-4 flex items-center gap-4 text-black">
            <FaMapMarkerAlt className="text-xl" />
            <p className="font-medium">
              Address : {companyAddress}
            </p>
          </div>

          <div className="border-b py-4 flex items-center gap-4 text-black">
            <FaPhone className="text-xl" />
            <p className="font-medium">{companyPhone}</p>
          </div>

          <div className="border-b py-4 flex items-center gap-4 text-black">
            <FaEnvelope className="text-xl" />
            <p className="font-medium">{companyEmail}</p>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div>
          <h2 className="text-3xl font-bold text-black mb-6">
            Tell Us Your Question
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name */}
            <div>
              <label className="font-semibold text-black">
                Your Name (required)
              </label>
              <input
                type="text"
                name="name"
                placeholder="Name *"
                value={form.name}
                onChange={handleChange}
                className="w-full border p-3 mt-1 outline-none text-black bg-white"
              />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="font-semibold text-black">
                Your Email (required)
              </label>
              <input
                type="email"
                name="email"
                placeholder="Email *"
                value={form.email}
                onChange={handleChange}
                className="w-full border p-3 mt-1 outline-none text-black bg-white"
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Mobile */}
            <div>
              <label className="font-semibold text-black">
                Your Mobile Number (required)
              </label>
              <input
                type="text"
                name="mobile"
                placeholder="Mobile Number *"
                value={form.mobile}
                onChange={handleChange}
                className="w-full border p-3 mt-1 outline-none text-black bg-white"
              />
              {errors.mobile && (
                <p className="text-red-600 text-sm mt-1">{errors.mobile}</p>
              )}
            </div>

            {/* Subject */}
            <div>
              <label className="font-semibold text-black">Subject</label>
              <input
                type="text"
                name="subject"
                placeholder="Subject *"
                value={form.subject}
                onChange={handleChange}
                className="w-full border p-3 mt-1 outline-none text-black bg-white"
              />
              {errors.subject && (
                <p className="text-red-600 text-sm mt-1">{errors.subject}</p>
              )}
            </div>

            {/* Message */}
            <div>
              <label className="font-semibold text-black">
                Your Message
              </label>
              <textarea
                name="message"
                placeholder="Message *"
                rows="4"
                value={form.message}
                onChange={handleChange}
                className="w-full border p-3 mt-1 outline-none text-black bg-white"
              ></textarea>
              {errors.message && (
                <p className="text-red-600 text-sm mt-1">{errors.message}</p>
              )}
            </div>

            <button
              disabled={isSubmitting}
              className="bg-black rounded cursor-pointer text-white px-8 py-3 font-semibold hover:bg-[#6f472a] transition disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Sending..." : "Send"}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}
