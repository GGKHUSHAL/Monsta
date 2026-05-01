import axios from "axios";
import iziToast from "izitoast";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../MainContext";

export default function AddTestimonial() {
  const { edit, Setedit } = useContext(AdminContext);
  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_APIBASEURL;

  const [formData, setFormData] = useState({
    _testimonialName: "",
    _testimonialMessage: "",
    _testimonialDesignation: "",
    _testimonialRating: "",
    _testimonialOrder: "",
    _testimonialStatus: true
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // wrong edit clear
  useEffect(() => {
    if (edit && !("_testimonialName" in edit)) {
      Setedit(null);
    }
  }, [edit, Setedit]);

  // edit data fill
  useEffect(() => {
    if (edit) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        _testimonialName: edit._testimonialName || "",
        _testimonialMessage: edit._testimonialMessage || "",
        _testimonialDesignation: edit._testimonialDesignation || "",
        _testimonialRating: edit._testimonialRating || "",
        _testimonialOrder: edit._testimonialOrder || "",
        _testimonialStatus:
          edit._testimonialStatus ?? true
      });

      if (edit.image) {
        const imgPath =
          localStorage.getItem(
            "testimonialImagpath"
          ) || "";

        setPreview(
          edit.image.startsWith("http")
            ? edit.image
            : `${imgPath}${edit.image}`
        );
      }
    } else {
      setFormData({
        _testimonialName: "",
        _testimonialMessage: "",
        _testimonialDesignation: "",
        _testimonialRating: "",
        _testimonialOrder: "",
        _testimonialStatus: true
      });

      setImage(null);
      setPreview(null);
    }
  }, [edit]);

  // input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  // image
  const handleImage = (e) => {
    let file = e.target.files[0];
    setImage(file);

    if (file) {
      setPreview(
        URL.createObjectURL(file)
      );
    }
  };

  // submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let formDataObj = new FormData();

      for (let key in formData) {
        formDataObj.append(
          key,
          formData[key]
        );
      }

      if (image) {
        formDataObj.append(
          "image",
          image
        );
      }

      // UPDATE
      if (edit) {
        let res = await axios.put(
          `${apiBaseUrl}testimonial/update/${edit._id}`,
          formDataObj,
          {
            headers: {
              "Content-Type":
                "multipart/form-data"
            }
          }
        );

        if (res.data._status) {
          iziToast.success({
            title: "Success",
            message:
              res.data._message,
            position: "topRight"
          });

          Setedit(null);

          setTimeout(() => {
            navigate(
              "/testimonial/view"
            );
          }, 1000);
        } else {
          iziToast.error({
            title: "Error",
            message:
              res.data._message,
            position: "topRight"
          });
        }

        return;
      }

      // CREATE
      let res = await axios.post(
        `${apiBaseUrl}testimonial/create`,
        formDataObj,
        {
          headers: {
            "Content-Type":
              "multipart/form-data"
          }
        }
      );

      if (res.data._status) {
        iziToast.success({
          title: "Success",
          message:
            res.data._message,
          position: "topRight"
        });

        setTimeout(() => {
          navigate(
            "/testimonial/view"
          );
        }, 1000);
      } else {
        iziToast.error({
          title: "Error",
          message:
            res.data._message,
          position: "topRight"
        });
      }
    } catch (error) {
      iziToast.error({
        title: "Error",
        message:
          error?.response?.data
            ?._message ||
          "Server Error",
        position: "topRight"
      });
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg border">

        {/* Header */}
        <div className="bg-gray-200 p-4 rounded-t-lg">
          <h2 className="text-xl font-semibold text-gray-800">
            {edit
              ? "Update Testimonial"
              : "Add New Testimonial"}
          </h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Image */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Image
              </label>

              <div className="border rounded-lg p-4 flex flex-col items-center justify-center bg-gray-50 h-64">
                {preview ? (
                  <img
                    src={preview}
                    className="h-full object-cover rounded"
                  />
                ) : (
                  <p className="text-gray-500">
                    Upload Image
                  </p>
                )}

                <input
                  type="file"
                  onChange={
                    handleImage
                  }
                  className="mt-3 text-sm"
                />
              </div>
            </div>

            {/* Right */}
            <div className="space-y-4">

              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Name
                </label>

                <input
                  type="text"
                  name="_testimonialName"
                  value={
                    formData._testimonialName
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter name"
                  className="w-full border rounded p-2"
                  required
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Message
                </label>

                <textarea
                  rows="4"
                  name="_testimonialMessage"
                  value={
                    formData._testimonialMessage
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter message"
                  className="w-full border rounded p-2"
                  required
                ></textarea>
              </div>

              {/* Job Title */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Job Title
                </label>

                <input
                  type="text"
                  name="_testimonialDesignation"
                  value={
                    formData._testimonialDesignation
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="CEO of SunPark"
                  className="w-full border rounded p-2"
                  required
                />
              </div>

              {/* Rating / Order */}
              <div className="grid grid-cols-2 gap-4">

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Rating
                  </label>

                  <input
                    type="number"
                    min="1"
                    max="5"
                    name="_testimonialRating"
                    value={
                      formData._testimonialRating
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="1 to 5"
                    className="w-full border rounded p-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Order
                  </label>

                  <input
                    type="number"
                    name="_testimonialOrder"
                    value={
                      formData._testimonialOrder
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter order"
                    className="w-full border rounded p-2"
                    required
                  />
                </div>

              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Status
                </label>

                <select
                  name="_testimonialStatus"
                  value={
                    formData._testimonialStatus
                  }
                  onChange={
                    handleChange
                  }
                  className="w-full border rounded p-2"
                >
                  <option value={true}>
                    Active
                  </option>
                  <option value={false}>
                    Inactive
                  </option>
                </select>
              </div>

            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-900 transition"
            >
              {edit
                ? "Update Testimonial"
                : "Submit"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
