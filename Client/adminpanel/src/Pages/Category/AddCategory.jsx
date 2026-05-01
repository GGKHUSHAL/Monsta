import axios from "axios";
import iziToast from "izitoast";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../MainContext";

export default function AddCategory() {

  const { edit, Setedit } = useContext(AdminContext);

  const [formData, setFormData] = useState({
    _categoryName: "",
    slug: "",
    description: "",
    metaTitle: "",
    metaDescription: "",
    _categoryOrder: "",
    _categoryStatus: "Active",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (edit && !("_categoryName" in edit)) {
      Setedit(null);
    }
  }, [edit, Setedit]);

  useEffect(() => {
    if (edit) {
      setFormData({
        _categoryName: edit._categoryName || "",
        slug: edit._categorySlug || "",
        description: edit._categoryDescription || "",
        metaTitle: edit._categoryMetaTitle || "",
        metaDescription: edit._categoryMetaDescription || "",
        _categoryOrder: edit._categoryOrder || "",
        _categoryStatus: edit._categoryStatus ? "Active" : "Inactive",
      });
      const imageField = edit.image || edit._categoryImage;
      if (imageField) {
        const imagpath = localStorage.getItem('categoryImagpath') || '';
        const imageUrl = imageField.startsWith('http') ? imageField : `${imagpath}${imageField}`;
        setPreview(imageUrl);
      }
    } else {
      setFormData({
        _categoryName: "",
        slug: "",
        description: "",
        metaTitle: "",
        metaDescription: "",
        _categoryOrder: "",
        _categoryStatus: "Active",
      });
      setImage(null);
      setPreview(null);
    }
  }, [edit]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const generateSlug = () => {
    const slug = formData._categoryName
      .toLowerCase()
      .replace(/\s+/g, "-");

    setFormData({
      ...formData,
      slug: slug,
    });
  };

  const apiBaseUrl = import.meta.env.VITE_APIBASEURL;
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (edit) {
        const formDataObj = new FormData(e.target);
        if (image) {
          formDataObj.set("image", image);
        }

        const res = await axios.put(`${apiBaseUrl}category/update/${edit._id}`, formDataObj, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const finalRes = res.data;

        if (finalRes._status) {
          iziToast.success({
            title: "Success",
            message: finalRes._message || "Category Updated Successfully",
            position: "topRight",
          });
          Setedit(null);
          setTimeout(() => {
            navigate("/category/view");
          }, 1500);
          return;
        }

        iziToast.error({
          title: "Error",
          message: finalRes._message || "Failed to update category",
          position: "topRight",
        });
        return;
      }

      const formDataObj = new FormData(e.target);
      if (image) {
        formDataObj.set("image", image);
      }

      const res = await axios.post(`${apiBaseUrl}category/create`, formDataObj, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const finalRes = res.data;

      if (finalRes._status) {
        iziToast.success({
          title: "Success",
          message: finalRes._message || "Category Created Successfully",
          position: "topRight",
        });
        setTimeout(() => {
          navigate("/category/view");
        }, 1500);
      } else {
        iziToast.error({
          title: "Error",
          message: finalRes._message || "Failed to create category",
          position: "topRight",
        });
      }
    } catch (error) {
      iziToast.error({
        title: "Error",
        message: error?.response?.data?._message || error.message || "Server error",
        position: "topRight",
      });
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg border">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-4 rounded-t-lg">
          <h2 className="text-xl font-semibold text-gray-800">
            {edit ? "Update Category" : "Add New Category"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Left - Image Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Category Image
              </label>

              <div className="border rounded-lg p-4 flex flex-col items-center justify-center bg-gray-50 h-64">

                {preview ? (
                  <img
                    src={preview}
                    alt="preview"
                    className="h-full object-cover rounded"
                  />
                ) : (
                  <div className="text-center text-gray-500">
                    <p>Upload Category Image</p>
                  </div>
                )}

                <input
                  type="file"
                  name="image"
                  onChange={handleImage}
                  className="mt-3 text-sm"
                  required
                />
              </div>
            </div>

            {/* Right - Basic Info */}
            <div className="space-y-4">

              {/* Category Name */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  name="_categoryName"
                  value={formData._categoryName}
                  onChange={handleChange}
                  onBlur={generateSlug}
                  placeholder="Example: Electronics, Furniture"
                  className="w-full border rounded p-2 focus:outline-blue-400"
                  required
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Slug (Auto Generated)
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="category-slug"
                  className="w-full border rounded p-2 focus:outline-blue-400"
                  required
                />
              </div>

              {/* Display Order */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  name="_categoryOrder"
                  value={formData._categoryOrder}
                  onChange={handleChange}
                  placeholder="Enter display order"
                  className="w-full border rounded p-2 focus:outline-blue-400"
                  required
                />
              </div>

            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Category Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter category description"
              className="w-full border rounded p-2 focus:outline-blue-400"
              rows="4"
            ></textarea>
          </div>

          {/* SEO Section */}
          <div className="p-4 border rounded bg-gray-50 space-y-4">

            <h3 className="font-semibold text-gray-700">
              SEO Details
            </h3>

            <div>
              <label className="block text-sm font-medium mb-1">
                Meta Title
              </label>
              <input
                type="text"
                name="metaTitle"
                value={formData.metaTitle}
                onChange={handleChange}
                placeholder="SEO Title"
                className="w-full border rounded p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Meta Description
              </label>
              <textarea
                name="metaDescription"
                value={formData.metaDescription}
                onChange={handleChange}
                placeholder="SEO Description"
                className="w-full border rounded p-2"
                rows="3"
              ></textarea>
            </div>

          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Status
            </label>

            <select
              name="_categoryStatus"
              value={formData._categoryStatus}
              onChange={handleChange}
              className="w-full border rounded p-2"
            >
              <option value={true}>Active</option>
              <option value={false}>Inactive</option>
            </select>
          </div>

          {/* Live Preview */}
          <div className="p-4 border rounded bg-gray-50">

            <h3 className="font-medium mb-3">Live Preview</h3>

            <div className="flex gap-6 items-center">

              {preview && (
                <img
                  src={preview}
                  className="w-24 h-24 rounded border"
                  alt="preview"
                />
              )}

              <div>
                <p>
                  <strong>Name:</strong>{" "}
                  {formData._categoryName || "N/A"}
                </p>

                <p>
                  <strong>Slug:</strong>{" "}
                  {formData.slug || "N/A"}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  {formData._categoryStatus}
                </p>
              </div>

            </div>

          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              {edit ? "Update Category" : "Submit Category"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
