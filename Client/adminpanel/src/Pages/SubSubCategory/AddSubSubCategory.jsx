import axios from "axios";
import iziToast from "izitoast";
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../MainContext";

export default function AddSubSubCategory() {

  const { edit, Setedit } = useContext(AdminContext);
  console.log(edit)
  const apiBaseUrl = import.meta.env.VITE_APIBASEURL;

  const [formData, setFormData] = useState({
    _subsubcategoryName: "",
    _parentCategoryId: "",
    parentCategoryName: "",
    _parentSubCategoryId: "",
    parentSubCategoryName: "",
    slug: "",
    description: "",
    metaTitle: "",
    metaDescription: "",
    _subsubcategoryOrder: "",
    _subsubcategoryStatus: "Active",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [parentCategories, setParentCategories] = useState([]);
  const [parentSubCategories, setParentSubCategories] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "_parentCategoryId") {
      console.log("Category changed to:", value);

      const selectedCategory = parentCategories.find(
        (category) =>
          String(category._id || category.id) === String(value)
      );

      console.log("Selected category object:", selectedCategory);

      setFormData({
        ...formData,
        _parentCategoryId: value,
        parentCategoryName:
          selectedCategory?._categoryName ||
          selectedCategory?.name ||
          "",
        _parentSubCategoryId: "",
        parentSubCategoryName: "",
      });

      if (value) {
        loadParentSubCategories(value);
      } else {
        console.log("No category selected, clearing subcategories");
        setParentSubCategories([]);
      }
      return;
    }

    if (name === "_parentSubCategoryId") {
      const selectedSubCategory = parentSubCategories.find(
        (subcategory) =>
          String(subcategory._id || subcategory.id) === String(value)
      );

      setFormData({
        ...formData,
        _parentSubCategoryId: value,
        parentSubCategoryName:
          selectedSubCategory?._subcategoryName ||
          selectedSubCategory?.name ||
          "",
      });
      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const loadParentSubCategories = (categoryId) => {
    console.log("Loading subcategories for category:", categoryId);

    axios
      .get(`${apiBaseUrl}subsubcategory/parentsubcategory/${categoryId}`)
      .then((res) => {
        console.log("Subcategory API response:", res.data);
        return res.data;
      })
      .then((finalRes) => {
        if (finalRes._status) {
          let subCats = finalRes.data || [];

          console.log("Setting subcategories:", subCats);
          setParentSubCategories(subCats);

          if (edit) {
            const selectedId = String(
              edit._subcategoryId?._id ||
              edit._parentSubCategoryId?._id ||
              edit._parentSubCategoryId ||
              formData._parentSubCategoryId ||
              ""
            );

            const found = subCats.find(
              (s) =>
                String(s._id || s.id) === selectedId
            );

            if (found) {
              setFormData((prev) => ({
                ...prev,
                _parentSubCategoryId: String(
                  found._id || found.id
                ),
                parentSubCategoryName:
                  found._subcategoryName ||
                  found.name ||
                  "",
              }));
            }
          }
        } else {
          console.log(
            "API returned false status:",
            finalRes._message
          );
          setParentSubCategories([]);
        }
      })
      .catch((error) => {
        console.error(
          "Error loading subcategories:",
          error
        );
        setParentSubCategories([]);
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
    if (edit && !("_subsubcategoryName" in edit)) {
      Setedit(null);
    }
  }, [edit, Setedit]);

  useEffect(() => {
    if (edit) {
      const parentCategoryId =
        typeof edit._parentCategoryId === "object"
          ? edit._parentCategoryId.id ||
            edit._parentCategoryId._id
          : edit._parentCategoryId ||
            edit.parentCategoryId ||
            "";

      const parentSubCategoryId =
        edit._subcategoryId?._id ||
        (typeof edit._parentSubCategoryId === "object"
          ? edit._parentSubCategoryId.id ||
            edit._parentSubCategoryId._id
          : edit._parentSubCategoryId ||
            edit.parentSubCategoryId ||
            "");

      setFormData({
        _subsubcategoryName:
          edit._subsubcategoryName || "",

        _parentCategoryId: String(parentCategoryId),

        parentCategoryName:
          edit._parentCategoryName ||
          edit.parentCategoryName ||
          (typeof edit._parentCategoryId === "object"
            ? edit._parentCategoryId._categoryName ||
              edit._parentCategoryId.name
            : ""),

        _parentSubCategoryId:
          String(parentSubCategoryId),

        parentSubCategoryName:
          edit._subcategoryId?._subcategoryName ||
          edit._parentSubCategoryName ||
          edit.parentSubCategoryName ||
          (typeof edit._parentSubCategoryId === "object"
            ? edit._parentSubCategoryId
                ._subcategoryName ||
              edit._parentSubCategoryId.name
            : ""),

        slug:
          edit.slug ||
          edit._subsubcategorySlug ||
          "",

        description:
          edit.description ||
          edit._subsubcategoryDescription ||
          "",

        metaTitle:
          edit.metaTitle ||
          edit._subsubcategoryMetaTitle ||
          "",

        metaDescription:
          edit.metaDescription ||
          edit._subsubcategoryMetaDescription ||
          "",

        _subsubcategoryOrder:
          edit._subsubcategoryOrder || "",

        _subsubcategoryStatus:
          edit._subsubcategoryStatus
            ? "true"
            : "false",
      });

      const imageField =
        edit.image || edit._subsubcategoryImage;

      if (imageField) {
        const imagpath =
          localStorage.getItem(
            "subsubcategoryImagpath"
          ) || "";

        const imageUrl =
          imageField.startsWith("http")
            ? imageField
            : `${imagpath}${imageField}`;

        setPreview(imageUrl);
      }

      if (parentCategoryId) {
        loadParentSubCategories(parentCategoryId);
      }
    } else {
      setFormData({
        _subsubcategoryName: "",
        _parentCategoryId: "",
        parentCategoryName: "",
        _parentSubCategoryId: "",
        parentSubCategoryName: "",
        slug: "",
        description: "",
        metaTitle: "",
        metaDescription: "",
        _subsubcategoryOrder: "",
        _subsubcategoryStatus: "Active",
      });

      setImage(null);
      setPreview(null);
      setParentSubCategories([]);
    }
  }, [edit]);

  useEffect(() => {
    if (edit && parentSubCategories.length > 0) {
      const selectedId = String(
        formData._parentSubCategoryId ||
        edit._subcategoryId?._id ||
        edit._parentSubCategoryId?._id ||
        edit._parentSubCategoryId ||
        ""
      );

      const found = parentSubCategories.find(
        (s) =>
          String(s._id || s.id) === selectedId
      );

      if (found) {
        setFormData((prev) => ({
          ...prev,
          _parentSubCategoryId: String(
            found._id || found.id
          ),
          parentSubCategoryName:
            found._subcategoryName ||
            found.name ||
            "",
        }));
      }
    }
  }, [parentSubCategories]);

  useEffect(() => {
    console.log("Loading parent categories...");

    axios
      .get(`${apiBaseUrl}subsubcategory/parentcategory`)
      .then((res) => {
        console.log(
          "Parent category API response:",
          res.data
        );
        return res.data;
      })
      .then((finalRes) => {
        if (finalRes._status) {
          console.log(
            "Setting parent categories:",
            finalRes.data
          );

          setParentCategories(
            finalRes.data || []
          );
        } else {
          console.log(
            "Parent category API returned false status:",
            finalRes._message
          );

          iziToast.warning({
            title: "Warning",
            message:
              finalRes._message ||
              "Unable to load parent categories",
            position: "topRight",
          });
        }
      })
      .catch((error) => {
        console.error(
          "Error loading parent categories:",
          error
        );

        iziToast.error({
          title: "Error",
          message:
            error?.response?.data?._message ||
            error.message ||
            "Failed to load categories",
          position: "topRight",
        });
      });
  }, [apiBaseUrl]);

  const generateSlug = () => {
    const slug = formData._subsubcategoryName
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

        formDataObj.set(
          "_parentCategoryId",
          formData._parentCategoryId || ""
        );

        formDataObj.set(
          "parentCategoryId",
          formData._parentCategoryId || ""
        );

        formDataObj.set(
          "_parentSubCategoryId",
          formData._parentSubCategoryId || ""
        );

        formDataObj.set(
          "parentSubCategoryId",
          formData._parentSubCategoryId || ""
        );

        const res = await axios.put(
          `${apiBaseUrl}subsubcategory/update/${edit._id}`,
          formDataObj,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

        const finalRes = res.data;

        if (finalRes._status) {
          iziToast.success({
            title: "Success",
            message:
              finalRes._message ||
              "Sub Sub Category Updated Successfully",
            position: "topRight",
          });

          Setedit(null);

          setTimeout(() => {
            navigate(
              "/subsubcategory/view"
            );
          }, 1500);

          return;
        }

        iziToast.error({
          title: "Error",
          message:
            finalRes._message ||
            "Failed to update sub sub category",
          position: "topRight",
        });

        return;
      }

      const formDataObj = new FormData(e.target);

      if (image) {
        formDataObj.set("image", image);
      }

      formDataObj.set(
        "_parentCategoryId",
        formData._parentCategoryId || ""
      );

      formDataObj.set(
        "parentCategoryId",
        formData._parentCategoryId || ""
      );

      formDataObj.set(
        "_parentSubCategoryId",
        formData._parentSubCategoryId || ""
      );

      formDataObj.set(
        "parentSubCategoryId",
        formData._parentSubCategoryId || ""
      );

      const res = await axios.post(
        `${apiBaseUrl}subsubcategory/create`,
        formDataObj,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      const finalRes = res.data;

      if (finalRes._status) {
        iziToast.success({
          title: "Success",
          message:
            finalRes._message ||
            "Sub Sub Category Created Successfully",
          position: "topRight",
        });

        setTimeout(() => {
          navigate("/subsubcategory/view");
        }, 1500);
      } else {
        iziToast.error({
          title: "Error",
          message:
            finalRes._message ||
            "Failed to create sub sub category",
          position: "topRight",
        });
      }
    } catch (error) {
      iziToast.error({
        title: "Error",
        message:
          error?.response?.data?._message ||
          error.message ||
          "Server error",
        position: "topRight",
      });
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg border">

        <div className="bg-linear-to-r from-purple-100 to-indigo-100 p-4 rounded-t-lg">
          <h2 className="text-xl font-semibold text-gray-800">
            {edit
              ? "Update Sub Sub Category"
              : "Add Sub Sub Category"}
          </h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <label className="block text-sm font-medium mb-2">
                Sub Sub Category Image
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
                    <p>
                      Upload Sub Sub Category Image
                    </p>
                  </div>
                )}

                <input
                  type="file"
                  name="image"
                  onChange={handleImage}
                  className="mt-3 text-sm"
                  required={!edit}
                />
              </div>
            </div>

            <div className="space-y-4">

              <div>
                <label className="block text-sm font-medium mb-1">
                  Sub Sub Category Name
                </label>

                <input
                  type="text"
                  name="_subsubcategoryName"
                  value={
                    formData._subsubcategoryName
                  }
                  onChange={handleChange}
                  onBlur={generateSlug}
                  placeholder="Example: Samsung Galaxy"
                  className="w-full border rounded p-2 focus:outline-purple-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Parent Category
                </label>

                <select
                  name="_parentCategoryId"
                  value={
                    formData._parentCategoryId
                  }
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                  required={!edit}
                >
                  <option value="">
                    Select Category
                  </option>

                  {parentCategories.map(
                    (category) => {
                      const categoryId =
                        category._id;

                      return (
                        <option
                          key={categoryId}
                          value={categoryId}
                        >
                          {
                            category._categoryName
                          }
                        </option>
                      );
                    }
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Parent Sub Category
                </label>

                <select
                  name="_parentSubCategoryId"
                  value={String(
                    formData._parentSubCategoryId || ""
                  )}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                  required={!edit}
                  disabled={
                    !formData._parentCategoryId
                  }
                >
                  <option value="">
                    Select Sub Category
                  </option>

                  {parentSubCategories.map(
                    (subcategory) => {
                      const subCategoryId = String(
                        subcategory.id ||
                        subcategory._id
                      );

                      return (
                        <option
                          key={subCategoryId}
                          value={subCategoryId}
                        >
                          {subcategory._subcategoryName ||
                            subcategory.name ||
                            subcategory.title}
                        </option>
                      );
                    }
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Slug (Auto Generated)
                </label>

                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="sub-sub-category-slug"
                  className="w-full border rounded p-2 focus:outline-purple-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Display Order
                </label>

                <input
                  type="number"
                  name="_subsubcategoryOrder"
                  value={
                    formData._subsubcategoryOrder
                  }
                  onChange={handleChange}
                  placeholder="Enter display order"
                  className="w-full border rounded p-2 focus:outline-purple-400"
                  required
                />
              </div>

            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter sub sub category description"
              className="w-full border rounded p-2 focus:outline-purple-400"
              rows="4"
            ></textarea>
          </div>

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
                value={
                  formData.metaDescription
                }
                onChange={handleChange}
                placeholder="SEO Description"
                className="w-full border rounded p-2"
                rows="3"
              ></textarea>
            </div>

          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Status
            </label>

            <select
              name="_subsubcategoryStatus"
              value={
                formData._subsubcategoryStatus
              }
              onChange={handleChange}
              className="w-full border rounded p-2"
            >
              <option value="true">
                Active
              </option>
              <option value="false">
                Inactive
              </option>
            </select>
          </div>

          <div className="p-4 border rounded bg-gray-50">

            <h3 className="font-medium mb-3">
              Live Preview
            </h3>

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
                  {formData._subsubcategoryName ||
                    "N/A"}
                </p>

                <p>
                  <strong>
                    Parent Category:
                  </strong>{" "}
                  {formData.parentCategoryName ||
                    "N/A"}
                </p>

                <p>
                  <strong>
                    Parent Sub Category:
                  </strong>{" "}
                  {formData.parentSubCategoryName ||
                    "N/A"}
                </p>

                <p>
                  <strong>Slug:</strong>{" "}
                  {formData.slug || "N/A"}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  {
                    formData._subsubcategoryStatus
                  }
                </p>
              </div>

            </div>

          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition"
            >
              {edit
                ? "Update Sub Sub Category"
                : "Submit Sub Sub Category"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}