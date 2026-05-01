import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { SketchPicker } from "react-color";
import { useNavigate } from "react-router-dom";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import { AdminContext } from "../MainContext";

export default function AddColor() {

  const apiBaseUrl = import.meta.env.VITE_APIBASEURL;
  const { edit, Setedit } = useContext(AdminContext);

  useEffect(() => {
    if (edit && !("_colorName" in edit)) {
      Setedit(null);
    }
  }, [edit, Setedit]);
  const navigate = useNavigate();

  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    colorName: edit?._colorName || "",
    colorCode: edit?._colorCode || "#000000",
    colorType: edit?._colorType || "Solid",
    order: edit?._colorOrder || "",
    status: edit?._colorStatus ?? true,
  });

  const [showPicker, setShowPicker] = useState(false);

  // INPUT CHANGE
  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: name === "status" ? value === "true" : value,
    });

  };

  // COLOR PICKER CHANGE
  const handleColorChange = (color) => {

    setFormData({
      ...formData,
      colorCode: color.hex,
    });

  };

  // SUBMIT
  const handleSubmit = async (e) => {

    e.preventDefault();

    const obj = {
      _colorName: formData.colorName,
      _colorType: formData.colorType,
      _colorCode: formData.colorCode,
      _colorOrder: formData.order,
      _colorStatus: formData.status,
    };

    try {

      if (edit) {

        const res = await axios.put(`${apiBaseUrl}color/update/${edit._id}`, obj);
        const finalres = res.data;

        if (finalres._status) {

          iziToast.success({
            title: "Success",
            message: finalres._message || "Color Updated Successfully",
            position: "topRight",
          });

          Setedit(null);

          setTimeout(() => {
            navigate("/color/view");
          }, 1500);

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

      } else {

        const res = await axios.post(`${apiBaseUrl}color/create`, obj);
        const finalres = res.data;

        if (finalres._status) {

          iziToast.success({
            title: "Success",
            message: finalres._message || "Color Added Successfully",
            position: "topRight",
          });

          setTimeout(() => {
            navigate("/color/view");
          }, 1500);

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

    } catch (err) {

      iziToast.error({
        title: "Error",
        message: "Server Error",
        position: "topRight",
      });

    }

  };

  return (

    <div className="p-6 bg-gray-100 min-h-screen">

      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-lg border">

        <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-t-lg">

          <h2 className="text-xl font-semibold text-gray-800">
            {edit ? "Update Color" : "Add New Color"}
          </h2>

        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* COLOR NAME */}

          <div>

            <label className="block text-sm font-medium mb-1">
              Color Name
            </label>

            {error?._colorName && (
              <span className="text-red-600">
                {error._colorName}
              </span>
            )}

            <input
              type="text"
              name="colorName"
              value={formData.colorName}
              onChange={handleChange}
              placeholder="Example: Red, Blue, Ocean Green"
              className="w-full border rounded p-2 focus:outline-purple-400"
            />

          </div>

          {/* COLOR TYPE */}

          <div>

            <label className="block text-sm font-medium mb-1">
              Color Type
            </label>

            <select
              name="colorType"
              value={formData.colorType}
              onChange={handleChange}
              className="w-full border rounded p-2"
            >

              <option>Solid</option>
              <option>Gradient</option>
              <option>Metallic</option>
              <option>Neon</option>

            </select>

          </div>

          {/* COLOR PICKER */}

          <div>

            <label className="block text-sm font-medium mb-1">
              Select Color
            </label>

            {error?._colorCode && (
              <span className="text-red-600">
                {error._colorCode}
              </span>
            )}

            <div className="flex items-center gap-4">

              <div
                onClick={() => setShowPicker(!showPicker)}
                className="w-16 h-10 border rounded cursor-pointer"
                style={{ background: formData.colorCode }}
              ></div>

              <input
                type="text"
                name="colorCode"
                value={formData.colorCode}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />

            </div>

            {showPicker && (

              <div className="mt-3">

                <SketchPicker
                  color={formData.colorCode}
                  onChange={handleColorChange}
                />

              </div>

            )}

          </div>

          {/* ORDER + STATUS */}

          <div className="grid grid-cols-2 gap-4">

            <div>

              <label className="block text-sm font-medium mb-1">
                Display Order
              </label>

              {error?._colorOrder && (
                <span className="text-red-600">
                  {error._colorOrder}
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

          {/* LIVE PREVIEW */}

          <div className="p-4 border rounded bg-gray-50">

            <h3 className="font-medium mb-2">
              Live Preview
            </h3>

            <div className="flex items-center gap-4">

              <div
                className="w-20 h-20 border rounded"
                style={{ background: formData.colorCode }}
              ></div>

              <div>

                <p>
                  <strong>Name:</strong> {formData.colorName || "N/A"}
                </p>

                <p>
                  <strong>Code:</strong> {formData.colorCode}
                </p>

                <p>
                  <strong>Type:</strong> {formData.colorType}
                </p>

              </div>

            </div>

          </div>

          {/* SUBMIT */}

          <div className="flex justify-end">

            <button
              type="submit"
              className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition"
            >

              {edit ? "Update Color" : "Submit Color"}

            </button>

          </div>

        </form>

      </div>

    </div>

  );

}