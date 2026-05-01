import React, {
  useContext,
  useEffect,
  useState
} from "react";
import axios from "axios";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import {
  FaCloudUploadAlt,
  FaTrash
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../MainContext";

export default function AddProduct() {
  const { edit, Setedit } =
    useContext(AdminContext);

  const apiBaseUrl =
    import.meta.env.VITE_APIBASEURL;

  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({
      name: "",
      orderName: "",
      parentCategory: "",
      subCategory: "",
      subSubCategory: "",
      material: [],
      color: [],
      productType: "",
      bestSelling: "No",
      topRated: "No",
      upsell: "No",
      price: "",
      salePrice: "",
      stock: "",
      shortDescription: "",
      description: "",
      status: "Active"
    });

  const [image, setImage] =
    useState(null);

  const [preview, setPreview] =
    useState(null);

  const [galleryImages, setGalleryImages] =
    useState([]);

  const [galleryPreview, setGalleryPreview] =
    useState([]);

  const [parentCategories, setParentCategories] =
    useState([]);

  const [subCategories, setSubCategories] =
    useState([]);

  const [subSubCategories, setSubSubCategories] =
    useState([]);

  const [materials, setMaterials] =
    useState([]);

  const [colors, setColors] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    fetchParentCategory();
    fetchMaterial();
    fetchColor();
  }, []);

  useEffect(() => {
    if (
      edit &&
      !("_productName" in edit)
    ) {
      Setedit(null);
    }
  }, [edit]);

  useEffect(() => {
    if (edit) {
      setFormData({
        name:
          edit._productName || "",

        orderName:
          edit._productOrder || "",

        parentCategory:
          typeof edit._productParentCategory ===
            "object"
            ? edit._productParentCategory?._id
            : edit._productParentCategory || "",

        subCategory:
          typeof edit._productSubCategory ===
            "object"
            ? edit._productSubCategory?._id
            : edit._productSubCategory || "",

        subSubCategory:
          typeof edit._productSubSubCategory ===
            "object"
            ? edit._productSubSubCategory?._id
            : edit._productSubSubCategory || "",

        material:
          edit._productMaterial
            ? edit._productMaterial.map(
                (item) =>
                  typeof item ===
                  "object"
                    ? item._id
                    : item
              )
            : [],

        color:
          edit._productColor || [],

        productType:
          edit._productType || "",

        bestSelling:
          edit._bestSelling
            ? "Yes"
            : "No",

        topRated:
          edit._topRated
            ? "Yes"
            : "No",

        upsell:
          edit._upsell
            ? "Yes"
            : "No",

        price:
          edit._productPrice || "",

        salePrice:
          edit._productSalePrice || "",

        stock:
          edit._productStock || "",

        shortDescription:
          edit._productShortDescription || "",

        description:
          edit._productDescription || "",

        status:
          edit._productStatus
            ? "Active"
            : "Inactive"
      });

      const parentId =
        typeof edit._productParentCategory ===
          "object"
          ? edit._productParentCategory?._id
          : edit._productParentCategory;

      const subId =
        typeof edit._productSubCategory ===
          "object"
          ? edit._productSubCategory?._id
          : edit._productSubCategory;

      if (parentId) {
        fetchSubCategory(parentId);
      }

      if (subId) {
        fetchSubSubCategory(subId);
      }

      if (edit.imagePath) {
        setPreview(edit.imagePath);
      } else if (edit.image) {
        setPreview(
          `${apiBaseUrl.replace(
            "/api/",
            "/"
          )}uploads/product/${edit.image}`
        );
      }

      if (
        edit.galleryPath &&
        edit.galleryPath.length > 0
      ) {
        setGalleryPreview(
          edit.galleryPath
        );
      } else if (
        edit.gallery &&
        edit.gallery.length > 0
      ) {
        setGalleryPreview(
          edit.gallery.map(
            (item) =>
              `${apiBaseUrl.replace(
                "/api/",
                "/"
              )}uploads/product/${item}`
          )
        );
      }
    } else {
      resetForm();
    }
  }, [edit]);

  const fetchParentCategory =
    async () => {
      try {
        let res =
          await axios.get(
            `${apiBaseUrl}product/parentcategory`
          );

        if (
          res.data._status
        ) {
          setParentCategories(
            res.data.data
          );
        }
      } catch (error) {}
    };

  const fetchSubCategory =
    async (id) => {
      try {
        let res =
          await axios.get(
            `${apiBaseUrl}product/parentsubcategory/${id}`
          );

        if (
          res.data._status
        ) {
          setSubCategories(
            res.data.data
          );
        }
      } catch (error) {}
    };

  const fetchSubSubCategory =
    async (id) => {
      try {
        let res =
          await axios.get(
            `${apiBaseUrl}product/parentsubsubcategory/${id}`
          );

        if (
          res.data._status
        ) {
          setSubSubCategories(
            res.data.data
          );
        }
      } catch (error) {}
    };

  const fetchMaterial =
    async () => {
      try {
        let res =
          await axios.get(
            `${apiBaseUrl}product/material`
          );

        if (
          res.data._status
        ) {
          setMaterials(
            res.data.data
          );
        }
      } catch (error) {}
    };

  const fetchColor =
    async () => {
      try {
        let res =
          await axios.get(
            `${apiBaseUrl}product/color`
          );

        if (
          res.data._status
        ) {
          setColors(
            res.data.data
          );
        }
      } catch (error) {}
    };

  const handleChange = (e) => {
    const { name, value } =
      e.target;

    setFormData({
      ...formData,
      [name]: value
    });

    if (
      name ===
      "parentCategory"
    ) {
      setFormData((prev) => ({
        ...prev,
        parentCategory:
          value,
        subCategory: "",
        subSubCategory:
          ""
      }));

      fetchSubCategory(value);
      setSubSubCategories([]);
    }

    if (
      name ===
      "subCategory"
    ) {
      setFormData((prev) => ({
        ...prev,
        subCategory:
          value,
        subSubCategory:
          ""
      }));

      fetchSubSubCategory(
        value
      );
    }
  };

  const handleCheckbox = (
    name,
    value
  ) => {
    let oldData = [
      ...formData[name]
    ];

    if (
      oldData.includes(
        value
      )
    ) {
      oldData =
        oldData.filter(
          (item) =>
            item !== value
        );
    } else {
      oldData.push(value);
    }

    setFormData({
      ...formData,
      [name]: oldData
    });
  };

  const handleImage = (e) => {
    const file =
      e.target.files[0];

    if (file) {
      setImage(file);
      setPreview(
        URL.createObjectURL(
          file
        )
      );
    }
  };

  const handleGallery = (
    e
  ) => {
    const files =
      Array.from(
        e.target.files
      );

    setGalleryImages(
      files
    );

    setGalleryPreview(
      files.map((file) =>
        URL.createObjectURL(
          file
        )
      )
    );
  };

  const removeMainImage =
    () => {
      setImage(null);
      setPreview(null);
    };

  const removeGalleryImage =
    (index) => {
      setGalleryImages(
        galleryImages.filter(
          (_, i) =>
            i !== index
        )
      );

      setGalleryPreview(
        galleryPreview.filter(
          (_, i) =>
            i !== index
        )
      );
    };

  const resetForm = () => {
    setFormData({
      name: "",
      orderName: "",
      parentCategory: "",
      subCategory: "",
      subSubCategory: "",
      material: [],
      color: [],
      productType: "",
      bestSelling: "No",
      topRated: "No",
      upsell: "No",
      price: "",
      salePrice: "",
      stock: "",
      shortDescription:
        "",
      description: "",
      status: "Active"
    });

    setImage(null);
    setPreview(null);
    setGalleryImages([]);
    setGalleryPreview([]);
    setSubCategories([]);
    setSubSubCategories([]);
  };

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      try {
        setLoading(true);

        let sendData =
          new FormData();

        sendData.append(
          "_productName",
          formData.name
        );

        sendData.append(
          "_productOrder",
          formData.orderName
        );

        sendData.append(
          "_productParentCategory",
          formData.parentCategory
        );

        sendData.append(
          "_productSubCategory",
          formData.subCategory
        );

        sendData.append(
          "_productSubSubCategory",
          formData.subSubCategory
        );

        formData.material.forEach(
          (item) => {
            sendData.append(
              "_productMaterial",
              item
            );
          }
        );

        formData.color.forEach(
          (item) => {
            sendData.append(
              "_productColor",
              item
            );
          }
        );

        sendData.append(
          "_productType",
          formData.productType
        );

        sendData.append(
          "_bestSelling",
          formData.bestSelling
        );

        sendData.append(
          "_topRated",
          formData.topRated
        );

        sendData.append(
          "_upsell",
          formData.upsell
        );

        sendData.append(
          "_productPrice",
          formData.price
        );

        sendData.append(
          "_productSalePrice",
          formData.salePrice
        );

        sendData.append(
          "_productStock",
          formData.stock
        );

        sendData.append(
          "_productShortDescription",
          formData.shortDescription
        );

        sendData.append(
          "_productDescription",
          formData.description
        );

        sendData.append(
          "_productStatus",
          formData.status
        );

        if (image) {
          sendData.append(
            "image",
            image
          );
        }

        galleryImages.forEach(
          (item) => {
            sendData.append(
              "gallery",
              item
            );
          }
        );

        let res;

        if (edit) {
          res =
            await axios.put(
              `${apiBaseUrl}product/update/${edit._id}`,
              sendData
            );
        } else {
          res =
            await axios.post(
              `${apiBaseUrl}product/addproduct`,
              sendData
            );
        }

        if (
          res.data._status
        ) {
          iziToast.success({
            title:
              "Success",
            message:
              res.data._message,
            position:
              "topRight"
          });

          Setedit(null);
          resetForm();

          setTimeout(() => {
            navigate(
              "/product/view"
            );
          }, 1200);
        } else {
          iziToast.error({
            title:
              "Error",
            message:
              res.data._message,
            position:
              "topRight"
          });
        }
      } catch (error) {
        iziToast.error({
          title:
            "Error",
          message:
            "Something went wrong",
          position:
            "topRight"
        });
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl border overflow-hidden">

        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
          <h2 className="text-2xl font-bold text-white">
            {edit
              ? "Update Product"
              : "Add Product"}
          </h2>

          <p className="text-blue-100 text-sm">
            {edit
              ? "Update existing product"
              : "Create new product with details"}
          </p>
        </div>

        <form
          onSubmit={
            handleSubmit
          }
          className="p-6 space-y-6"
        >

          <div className="grid lg:grid-cols-2 gap-6">

            <div>
              <label className="font-semibold block mb-2">
                Product Image
              </label>

              <div className="h-96 border-2 border-dashed rounded-2xl bg-gray-50 relative flex items-center justify-center overflow-hidden">

                {preview ? (
                  <>
                    <img
                      src={preview}
                      className="w-full h-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={
                        removeMainImage
                      }
                      className="absolute top-3 right-3 bg-red-600 text-white p-2 rounded-full"
                    >
                      <FaTrash />
                    </button>
                  </>
                ) : (
                  <div className="text-center">
                    <FaCloudUploadAlt className="text-5xl text-gray-400 mx-auto" />

                    <p className="mt-2 text-gray-500">
                      Select Main Image
                    </p>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={
                    handleImage
                  }
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>

            <div className="space-y-4">

              <input
                type="text"
                name="name"
                placeholder="Product Name"
                value={
                  formData.name
                }
                onChange={
                  handleChange
                }
                className="w-full border rounded-xl px-4 py-3"
              />

              <input
                type="number"
                name="orderName"
                placeholder="Order Number"
                value={
                  formData.orderName
                }
                onChange={
                  handleChange
                }
                className="w-full border rounded-xl px-4 py-3"
              />

              <div className="grid md:grid-cols-3 gap-3">

                <select
                  name="parentCategory"
                  value={
                    formData.parentCategory
                  }
                  onChange={
                    handleChange
                  }
                  className="border rounded-xl px-3 py-3"
                >
                  <option value="">
                    Parent Category
                  </option>

                  {parentCategories.map(
                    (item) => (
                      <option
                        key={
                          item._id
                        }
                        value={
                          item._id
                        }
                      >
                        {
                          item._categoryName
                        }
                      </option>
                    )
                  )}
                </select>

                <select
                  name="subCategory"
                  value={
                    formData.subCategory
                  }
                  onChange={
                    handleChange
                  }
                  className="border rounded-xl px-3 py-3"
                >
                  <option value="">
                    Sub Category
                  </option>

                  {subCategories.map(
                    (item) => (
                      <option
                        key={
                          item._id
                        }
                        value={
                          item._id
                        }
                      >
                        {
                          item._subcategoryName
                        }
                      </option>
                    )
                  )}
                </select>

                <select
                  name="subSubCategory"
                  value={
                    formData.subSubCategory
                  }
                  onChange={
                    handleChange
                  }
                  className="border rounded-xl px-3 py-3"
                >
                  <option value="">
                    Sub Sub Category
                  </option>

                  {subSubCategories.map(
                    (item) => (
                      <option
                        key={
                          item._id
                        }
                        value={
                          item._id
                        }
                      >
                        {
                          item._subsubcategoryName
                        }
                      </option>
                    )
                  )}
                </select>

              </div>

              <div className="grid md:grid-cols-2 gap-3">

                <div className="border rounded-xl p-3 h-32 overflow-y-auto">
                  <p className="font-medium mb-2">
                    Material
                  </p>

                  {materials.map(
                    (item) => (
                      <label
                        key={
                          item._id
                        }
                        className="flex gap-2 mb-2"
                      >
                        <input
                          type="checkbox"
                          checked={formData.material.includes(
                            item._id
                          )}
                          onChange={() =>
                            handleCheckbox(
                              "material",
                              item._id
                            )
                          }
                        />
                        {
                          item._materialName
                        }
                      </label>
                    )
                  )}
                </div>

                <div className="border rounded-xl p-3 h-32 overflow-y-auto">
                  <p className="font-medium mb-2">
                    Color
                  </p>

                  {colors.map(
                    (
                      item,
                      index
                    ) => (
                      <label
                        key={
                          index
                        }
                        className="flex gap-2 mb-2"
                      >
                        <input
                          type="checkbox"
                          checked={formData.color.includes(
                            item._colorName
                          )}
                          onChange={() =>
                            handleCheckbox(
                              "color",
                              item._colorName
                            )
                          }
                        />
                        {
                          item._colorName
                        }
                      </label>
                    )
                  )}
                </div>

              </div>

              <div className="grid md:grid-cols-2 gap-3">

                <select
                  name="productType"
                  value={
                    formData.productType
                  }
                  onChange={
                    handleChange
                  }
                  className="border rounded-xl px-3 py-3"
                >
                  <option value="">
                    Select Product Type
                  </option>

                  <option value="featured">
                    Featured
                  </option>

                  <option value="new arrivals">
                    New Arrivals
                  </option>

                  <option value="onsale">
                    On Sale
                  </option>
                </select>

                <select
                  name="status"
                  value={
                    formData.status
                  }
                  onChange={
                    handleChange
                  }
                  className="border rounded-xl px-3 py-3"
                >
                  <option>
                    Active
                  </option>

                  <option>
                    Inactive
                  </option>
                </select>

              </div>

              <div className="grid md:grid-cols-3 gap-3">

                <select
                  name="bestSelling"
                  value={
                    formData.bestSelling
                  }
                  onChange={
                    handleChange
                  }
                  className="border rounded-xl px-3 py-3"
                >
                  <option value="No">
                    Best Selling - No
                  </option>

                  <option value="Yes">
                    Best Selling - Yes
                  </option>
                </select>

                <select
                  name="topRated"
                  value={
                    formData.topRated
                  }
                  onChange={
                    handleChange
                  }
                  className="border rounded-xl px-3 py-3"
                >
                  <option value="No">
                    Top Rated - No
                  </option>

                  <option value="Yes">
                    Top Rated - Yes
                  </option>
                </select>

                <select
                  name="upsell"
                  value={
                    formData.upsell
                  }
                  onChange={
                    handleChange
                  }
                  className="border rounded-xl px-3 py-3"
                >
                  <option value="No">
                    Upsell - No
                  </option>

                  <option value="Yes">
                    Upsell - Yes
                  </option>
                </select>

              </div>

              <div className="grid md:grid-cols-3 gap-3">

                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={
                    formData.price
                  }
                  onChange={
                    handleChange
                  }
                  className="border rounded-xl px-4 py-3"
                />

                <input
                  type="number"
                  name="salePrice"
                  placeholder="Sale Price"
                  value={
                    formData.salePrice
                  }
                  onChange={
                    handleChange
                  }
                  className="border rounded-xl px-4 py-3"
                />

                <input
                  type="number"
                  name="stock"
                  placeholder="Stock"
                  value={
                    formData.stock
                  }
                  onChange={
                    handleChange
                  }
                  className="border rounded-xl px-4 py-3"
                />

              </div>

            </div>
          </div>

          <div>
            <label className="font-semibold block mb-2">
              Product Gallery Images
            </label>

            <div className="border-2 border-dashed rounded-2xl bg-gray-50 p-5">

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={
                  handleGallery
                }
                className="mb-4"
              />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                {galleryPreview.map(
                  (
                    item,
                    index
                  ) => (
                    <div
                      key={
                        index
                      }
                      className="relative h-32 rounded-xl overflow-hidden border bg-white"
                    >
                      <img
                        src={
                          item
                        }
                        className="w-full h-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removeGalleryImage(
                            index
                          )
                        }
                        className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  )
                )}

              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">

            <textarea
              rows="4"
              name="shortDescription"
              placeholder="Short Description"
              value={
                formData.shortDescription
              }
              onChange={
                handleChange
              }
              className="border rounded-2xl px-4 py-3"
            ></textarea>

            <textarea
              rows="4"
              name="description"
              placeholder="Long Description"
              value={
                formData.description
              }
              onChange={
                handleChange
              }
              className="border rounded-2xl px-4 py-3"
            ></textarea>

          </div>

          <div className="text-right">
            <button
              type="submit"
              disabled={
                loading
              }
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold"
            >
              {loading
                ? "Please Wait..."
                : edit
                ? "Update Product"
                : "Submit Product"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}