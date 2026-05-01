import axios from "axios";
import iziToast from "izitoast";
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../MainContext";

export default function AddSubCategory() {

  const { edit, Setedit } = useContext(AdminContext);
  const apiBaseUrl = import.meta.env.VITE_APIBASEURL;

  const [formData, setFormData] = useState({
    _subcategoryName: "",
    _parentCategoryId: "",
    parentCategoryName: "",
    slug: "",
    description: "",
    metaTitle: "",
    metaDescription: "",
    _subcategoryOrder: "",
    _subcategoryStatus: "Active",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [parentCategories, setParentCategories] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "_parentCategoryId") {
      const selectedCategory = parentCategories.find((category) => category._id === value);
      setFormData({
        ...formData,
        _parentCategoryId: value,
        parentCategoryName: selectedCategory?._categoryName || selectedCategory?.name || "",
      });
      return;
    }

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

  useEffect(() => {
    if (edit && !("_subcategoryName" in edit)) {
      Setedit(null);
    }
  }, [edit, Setedit]);

  useEffect(() => {
    if (edit) {
      const parentCategoryId = typeof edit._parentCategoryId === "object" 
        ? edit._parentCategoryId._id || edit._parentCategoryId.id 
        : edit._parentCategoryId || edit.parentCategoryId || "";

      setFormData({
        _subcategoryName: edit._subcategoryName || "",
        _parentCategoryId: parentCategoryId,
        parentCategoryName: edit._parentCategoryName || edit.parentCategoryName || 
                          (typeof edit._parentCategoryId === "object" ? edit._parentCategoryId._categoryName || edit._parentCategoryId.name : ""),
        slug: edit.slug || edit._subcategorySlug || "",
        description: edit.description || edit._subcategoryDescription || "",
        metaTitle: edit.metaTitle || edit._subcategoryMetaTitle || "",
        metaDescription: edit.metaDescription || edit._subcategoryMetaDescription || "",
        _subcategoryOrder: edit._subcategoryOrder || "",
        _subcategoryStatus: edit._subcategoryStatus ? "true" : "false",
      });
      const imageField = edit.image || edit._subcategoryImage;
      if (imageField) {
        const imagpath = localStorage.getItem('subcategoryImagpath') || '';
        const imageUrl = imageField.startsWith('http') ? imageField : `${imagpath}${imageField}`;
        setPreview(imageUrl);
      }
    } else {
      setFormData({
        _subcategoryName: "",
        _parentCategoryId: "",
        parentCategoryName: "",
        slug: "",
        description: "",
        metaTitle: "",
        metaDescription: "",
        _subcategoryOrder: "",
        _subcategoryStatus: "Active",
      });
      setImage(null);
      setPreview(null);
    }
  }, [edit]);

  useEffect(() => {
    axios
      .get(`${apiBaseUrl}category/view`)
      .then((res) => res.data)
      .then((finalRes) => {
        if (finalRes._status) {
          setParentCategories(finalRes.data || []);
        } else {
          iziToast.warning({
            title: "Warning",
            message: finalRes._message || "Unable to load parent categories",
            position: "topRight",
          });
        }
      })
      .catch((error) => {
        iziToast.error({
          title: "Error",
          message: error?.response?.data?._message || error.message || "Failed to load categories",
          position: "topRight",
        });
      });
  }, [apiBaseUrl]);

  const generateSlug = () => {
    const slug = formData._subcategoryName
      .toLowerCase()
      .replace(/\s+/g, "-");

    setFormData({
      ...formData,
      slug: slug,
    });
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (edit) {
        const formDataObj = new FormData(e.target);
        if (image) {
          formDataObj.set("image", image);
        }

        const res = await axios.put(`${apiBaseUrl}subcategory/update/${edit._id}`, formDataObj, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const finalRes = res.data;
        if (finalRes._status) {
          iziToast.success({
            title: "Success",
            message: finalRes._message || "Sub Category Updated Successfully",
            position: "topRight",
          });
          Setedit(null);
          setTimeout(() => {
            navigate("/subcategory/view");
          }, 1500);
          return;
        }

        iziToast.error({
          title: "Error",
          message: finalRes._message || "Failed to update sub category",
          position: "topRight",
        });
        return;
      }

      const formDataObj = new FormData(e.target);
      if (image) {
        formDataObj.set("image", image);
      }

      const res = await axios.post(`${apiBaseUrl}subcategory/create`, formDataObj, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const finalRes = res.data;
      if (finalRes._status) {
        iziToast.success({
          title: "Success",
          message: finalRes._message || "Sub Category Created Successfully",
          position: "topRight",
        });
        setTimeout(() => {
          navigate("/subcategory/view");
        }, 1500);
      } else {
        iziToast.error({
          title: "Error",
          message: finalRes._message || "Failed to create sub category",
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
        <div className="bg-linear-to-r from-purple-100 to-indigo-100 p-4 rounded-t-lg">
          <h2 className="text-xl font-semibold text-gray-800">
            {edit ? "Update Sub Category" : "Add Sub Category"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Sub Category Image
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
                    <p>Upload Sub Category Image</p>
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

            {/* Right Side Fields */}
            <div className="space-y-4">

              {/* Sub Category Name */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Sub Category Name
                </label>
                <input
                  type="text"
                  name="_subcategoryName"
                  value={formData._subcategoryName}
                  onChange={handleChange}
                  onBlur={generateSlug}
                  placeholder="Example: Mobile Phones"
                  className="w-full border rounded p-2 focus:outline-purple-400"
                  required
                />
              </div>

              {/* Parent Category */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Parent Category
                </label>

                <select
                  name="_parentCategoryId"
                  value={formData._parentCategoryId}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                  required={!edit}
                >
                  <option value="">Select Category</option>
                  {parentCategories.map((category) => (
                    <option
                      key={category._id}
                      value={category._id}
                    >
                      {category._categoryName || category.name || category.title}
                    </option>
                  ))}
                </select>
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
                  placeholder="sub-category-slug"
                  className="w-full border rounded p-2 focus:outline-purple-400"
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
                  name="_subcategoryOrder"
                  value={formData._subcategoryOrder}
                  onChange={handleChange}
                  placeholder="Enter display order"
                  className="w-full border rounded p-2 focus:outline-purple-400"
                  required
                />
              </div>

            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter sub category description"
              className="w-full border rounded p-2 focus:outline-purple-400"
              rows="4"
              
            ></textarea>
          </div>

          {/* SEO SECTION */}
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
              name="_subcategoryStatus"
              value={formData._subcategoryStatus}
              onChange={handleChange}
              className="w-full border rounded p-2"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
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
                  {formData._subcategoryName || "N/A"}
                </p>

                <p>
                  <strong>Parent:</strong>{" "}
                  {formData.parentCategoryName || "N/A"}
                </p>
                <p>
                  <strong>Slug:</strong>{" "}
                  {formData.slug || "N/A"}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  {formData._subcategoryStatus}
                </p>
              </div>

            </div>

          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition"
            >
              {edit ? "Update Sub Category" : "Submit Sub Category"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
