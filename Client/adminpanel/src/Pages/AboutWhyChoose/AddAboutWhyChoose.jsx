import axios from "axios";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../MainContext";

export default function AddAboutWhyChoose() {
  const { edit, Setedit } = useContext(AdminContext);
  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_APIBASEURL;

  const [formData, setFormData] = useState({
    _aboutWhyChooseTitle: "",
    _aboutWhyChooseDescription: "",
    _aboutWhyChooseOrder: "",
    _aboutWhyChooseStatus: true
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (edit && !("_aboutWhyChooseTitle" in edit)) {
      Setedit(null);
    }
  }, [edit, Setedit]);

  useEffect(() => {
    if (edit) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        _aboutWhyChooseTitle: edit._aboutWhyChooseTitle || "",
        _aboutWhyChooseDescription: edit._aboutWhyChooseDescription || "",
        _aboutWhyChooseOrder: edit._aboutWhyChooseOrder || "",
        _aboutWhyChooseStatus: edit._aboutWhyChooseStatus ?? true
      });

      if (edit.image) {
        const imgPath = localStorage.getItem("aboutWhyChooseImagePath") || "";
        setPreview(`${imgPath}${edit.image}`);
      }
    } else {
      setFormData({
        _aboutWhyChooseTitle: "",
        _aboutWhyChooseDescription: "",
        _aboutWhyChooseOrder: "",
        _aboutWhyChooseStatus: true
      });
      setImage(null);
      setPreview(null);
    }
  }, [edit]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: name === "_aboutWhyChooseStatus" ? value === "true" : value
    });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const fd = new FormData();

      Object.keys(formData).forEach((key) => {
        fd.append(key, formData[key]);
      });

      if (image) {
        fd.append("image", image);
      }

      if (edit) {
        const res = await axios.put(
          `${apiBaseUrl}about-why-choose-us/update/${edit._id}`,
          fd
        );

        if (res.data._status) {
          iziToast.success({
            title: "Success",
            message: res.data._message,
            position: "topRight"
          });
          Setedit(null);
          setTimeout(() => navigate("/about-whychoose/view"), 1000);
        } else {
          iziToast.error({
            title: "Error",
            message: res.data._message,
            position: "topRight"
          });
        }

        return;
      }

      const res = await axios.post(
        `${apiBaseUrl}about-why-choose-us/create`,
        fd
      );

      if (res.data._status) {
        iziToast.success({
          title: "Success",
          message: res.data._message,
          position: "topRight"
        });
        setTimeout(() => navigate("/about-whychoose/view"), 1000);
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
        message: error?.response?.data?._message || "Server Error",
        position: "topRight"
      });
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg border">
        <div className="bg-blue-100 p-4 rounded-t-lg">
          <h2 className="text-xl font-semibold text-gray-800">
            {edit ? "Update About Why Choose Us" : "Add About Why Choose Us"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Image
              </label>

              <div className="border rounded-lg p-4 flex flex-col items-center justify-center bg-gray-50 h-64">
                {preview ? (
                  <img
                    src={preview}
                    alt="About why choose preview"
                    className="h-full object-cover rounded"
                  />
                ) : (
                  <p className="text-gray-500">
                    Upload Image for right-side card, optional for icon items
                  </p>
                )}

                <input
                  type="file"
                  name="image"
                  onChange={handleImage}
                  className="mt-3 text-sm"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="_aboutWhyChooseTitle"
                  value={formData._aboutWhyChooseTitle}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  rows="4"
                  name="_aboutWhyChooseDescription"
                  value={formData._aboutWhyChooseDescription}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                  required
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Order
                  </label>
                  <input
                    type="number"
                    name="_aboutWhyChooseOrder"
                    value={formData._aboutWhyChooseOrder}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Status
                  </label>
                  <select
                    name="_aboutWhyChooseStatus"
                    value={formData._aboutWhyChooseStatus.toString()}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              {edit ? "Update" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
