import axios from "axios";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import { AdminContext } from "../MainContext";

export default function AddFAQ() {

  const apiBaseUrl = import.meta.env.VITE_APIBASEURL;
  const { edit, Setedit } = useContext(AdminContext);

  const navigate = useNavigate();

  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    question: edit?._faqQuestion || "",
    answer: edit?._faqAnswere || "",
    order: edit?._faqOrder || "",
    status: edit?._faqStatus ?? true,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: name === "status" ? value === "true" : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const obj = {
      _faqQuestion: formData.question,
      _faqAnswere: formData.answer,
      _faqOrder: formData.order,
      _faqStatus: formData.status,
    };

    try {

      // UPDATE
      if (edit) {

        const res = await axios.put(`${apiBaseUrl}faq/update/${edit._id}`, obj);
        const finalres = res.data;

        if (finalres._status) {

          iziToast.success({
            title: "Success",
            message: finalres._message || "FAQ Updated Successfully",
            position: "topRight",
            timeout: 2000,
          });

          Setedit(null);

          setTimeout(() => {
            navigate("/faq/view");
          }, 2000);

        } else {

          if (finalres._message) {

            iziToast.error({
              title: "Error",
              message: finalres._message,
              position: "topRight",
            });

          } else {

            setError(finalres.err);

          }

        }

      }

      // CREATE
      else {

        const res = await axios.post(`${apiBaseUrl}faq/create`, obj);
        const finalres = res.data;

        if (finalres._status) {

          iziToast.success({
            title: "Success",
            message: finalres._message || "FAQ Added Successfully",
            position: "topRight",
            timeout: 2000,
          });

          setTimeout(() => {
            navigate("/faq/view");
          }, 2000);

        } else {

          if (finalres._message) {

            iziToast.error({
              title: "Error",
              message: finalres._message,
              position: "topRight",
            });

          } else {

            setError(finalres.err);

          }

        }

      }

    } catch (error) {

      iziToast.error({
        title: "Error",
        message: "Server Error",
        position: "topRight",
      });

    }

  };

  return (
    <>
      <div className="p-6 bg-gray-100 min-h-screen">

        <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-lg border">

          <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-t-lg">

            <h2 className="text-xl font-semibold text-gray-800">
              {edit ? "Update FAQ" : "Add New FAQ"}
            </h2>

          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">

            {/* Question */}

            <div>

              <label className="block text-sm font-medium mb-1">
                Question
              </label>

              {error?._question && (
                <span className="text-red-600">
                  {error._question}
                </span>
              )}

              <input
                type="text"
                name="question"
                value={formData.question}
                onChange={handleChange}
                placeholder="Enter FAQ Question"
                className="w-full border rounded p-2 focus:outline-purple-400"
              />

            </div>

            {/* Answer */}

            <div>

              <label className="block text-sm font-medium mb-1">
                Answer
              </label>

              {error?._answer && (
                <span className="text-red-600">
                  {error._answer}
                </span>
              )}

              <textarea
                name="answer"
                value={formData.answer}
                onChange={handleChange}
                rows="4"
                placeholder="Enter FAQ Answer"
                className="w-full border rounded p-2 focus:outline-purple-400"
              />

            </div>

            {/* Order + Status */}

            <div className="grid grid-cols-2 gap-4">

              <div>

                <label className="block text-sm font-medium mb-1">
                  Display Order
                </label>

                {error?._order && (
                  <span className="text-red-600">
                    {error._order}
                  </span>
                )}

                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleChange}
                  placeholder="Enter display order"
                  className="w-full border rounded p-2 focus:outline-purple-400"
                />

              </div>

              <div>

                <label className="block text-sm font-medium mb-1">
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status.toString()}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                >

                  <option value="true">Active</option>
                  <option value="false">Inactive</option>

                </select>

              </div>

            </div>

            {/* Preview */}

            <div className="p-4 border rounded bg-gray-50">

              <h3 className="font-medium mb-2">Preview</h3>

              <p className="font-semibold">
                {formData.question || "Question Preview"}
              </p>

              <p className="text-gray-600">
                {formData.answer || "Answer Preview"}
              </p>

            </div>

            {/* Submit */}

            <div className="flex justify-end">

              <button
                type="submit"
                className="bg-purple-600 cursor-pointer text-white px-6 py-2 rounded hover:bg-purple-700 transition"
              >

                {edit ? "Update FAQ" : "Submit FAQ"}

              </button>

            </div>

          </form>

        </div>

      </div>
    </>
  );
}