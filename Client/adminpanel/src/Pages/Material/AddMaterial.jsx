import axios from "axios";
import React, {
  useState,
  useEffect,
  useContext
} from "react";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../MainContext";

export default function AddMaterial() {
  const navigate =
    useNavigate();

  const apiBaseUrl =
    import.meta.env.VITE_APIBASEURL;

  const { edit, Setedit } =
    useContext(AdminContext);

  const [formData, setFormData] =
    useState({
      _materialName: "",
      _materialDescription:
        "",
      _materialType:
        "Fabric",
      _materialPriceImpact:
        "",
      _materialOrder: "",
      _materialStatus:
        true,
      _materialSupportColors:
        true
    });

  const [image, setImage] =
    useState(null);

  const [preview, setPreview] =
    useState(null);

  // edit data fill
  useEffect(() => {
    if (edit) {
      setFormData({
        _materialName:
          edit._materialName ||
          "",
        _materialDescription:
          edit._materialDescription ||
          "",
        _materialType:
          edit._materialType ||
          "Fabric",
        _materialPriceImpact:
          edit._materialPriceImpact ||
          "",
        _materialOrder:
          edit._materialOrder ||
          "",
        _materialStatus:
          edit._materialStatus ??
          true,
        _materialSupportColors:
          edit._materialSupportColors ??
          true
      });

      if (edit.image) {
        const imgPath =
          localStorage.getItem(
            "materialImagpath"
          ) || "";

        setPreview(
          `${imgPath}${edit.image}`
        );
      }
    }
  }, [edit]);

  const handleChange = (
    e
  ) => {
    const {
      name,
      value
    } = e.target;

    setFormData({
      ...formData,
      [name]:
        value === "true"
          ? true
          : value ===
            "false"
          ? false
          : value
    });
  };

  const handleImage = (
    e
  ) => {
    const file =
      e.target.files[0];

    setImage(file);

    if (file) {
      setPreview(
        URL.createObjectURL(
          file
        )
      );
    }
  };

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      try {
        let fd =
          new FormData();

        for (let key in formData) {
          fd.append(
            key,
            formData[key]
          );
        }

        if (image) {
          fd.append(
            "image",
            image
          );
        }

        // UPDATE
        if (edit) {
          let res =
            await axios.put(
              `${apiBaseUrl}material/update/${edit._id}`,
              fd
            );

          if (
            res.data._status
          ) {
            iziToast.success(
              {
                title:
                  "Success",
                message:
                  res.data._message,
                position:
                  "topRight"
              }
            );

            Setedit(
              null
            );

            setTimeout(
              () => {
                navigate(
                  "/material/view"
                );
              },
              1000
            );
          } else {
            iziToast.error(
              {
                title:
                  "Error",
                message:
                  res.data._message,
                position:
                  "topRight"
              }
            );
          }

          return;
        }

        // CREATE
        let res =
          await axios.post(
            `${apiBaseUrl}material/create`,
            fd
          );

        if (
          res.data._status
        ) {
          iziToast.success(
            {
              title:
                "Success",
              message:
                res.data._message,
              position:
                "topRight"
            }
          );

          setTimeout(
            () => {
              navigate(
                "/material/view"
              );
            },
            1000
          );
        } else {
          iziToast.error(
            {
              title:
                "Error",
              message:
                res.data._message,
              position:
                "topRight"
            }
          );
        }
      } catch (error) {
        iziToast.error({
          title: "Error",
          message:
            error?.response
              ?.data
              ?._message ||
            "Server Error",
          position:
            "topRight"
        });
      }
    };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg border">

        {/* Header */}
        <div className="bg-gradient-to-r from-green-100 to-teal-100 p-4 rounded-t-lg">
          <h2 className="text-xl font-semibold text-gray-800">
            {edit
              ? "Update Material"
              : "Add New Material"}
          </h2>
        </div>

        <form
          onSubmit={
            handleSubmit
          }
          className="p-6 space-y-6"
        >

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* IMAGE */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Material Image
              </label>

              <div className="border rounded-lg p-4 flex flex-col items-center justify-center bg-gray-50 h-64">

                {preview ? (
                  <img
                    src={
                      preview
                    }
                    className="h-full object-cover rounded"
                  />
                ) : (
                  <p className="text-gray-500">
                    Upload
                    Material
                    Image
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

            {/* RIGHT SIDE */}
            <div className="space-y-4">

              <div>
                <label className="block text-sm font-medium mb-1">
                  Material Name
                </label>

                <input
                  type="text"
                  name="_materialName"
                  value={
                    formData._materialName
                  }
                  onChange={
                    handleChange
                  }
                  className="w-full border rounded p-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Material Type
                </label>

                <select
                  name="_materialType"
                  value={
                    formData._materialType
                  }
                  onChange={
                    handleChange
                  }
                  className="w-full border rounded p-2"
                >
                  <option>
                    Fabric
                  </option>
                  <option>
                    Wood
                  </option>
                  <option>
                    Metal
                  </option>
                  <option>
                    Plastic
                  </option>
                  <option>
                    Leather
                  </option>
                  <option>
                    Glass
                  </option>
                  <option>
                    Rubber
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>

                <textarea
                  rows="4"
                  name="_materialDescription"
                  value={
                    formData._materialDescription
                  }
                  onChange={
                    handleChange
                  }
                  className="w-full border rounded p-2"
                  required
                ></textarea>
              </div>

            </div>
          </div>

          {/* EXTRA */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div>
              <label className="block text-sm font-medium mb-1">
                Price
                Impact ₹
              </label>

              <input
                type="number"
                name="_materialPriceImpact"
                value={
                  formData._materialPriceImpact
                }
                onChange={
                  handleChange
                }
                className="w-full border rounded p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Support
                Colors
              </label>

              <select
                name="_materialSupportColors"
                value={
                  formData._materialSupportColors.toString()
                }
                onChange={
                  handleChange
                }
                className="w-full border rounded p-2"
              >
                <option value="true">
                  Yes
                </option>
                <option value="false">
                  No
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Display
                Order
              </label>

              <input
                type="number"
                name="_materialOrder"
                value={
                  formData._materialOrder
                }
                onChange={
                  handleChange
                }
                className="w-full border rounded p-2"
                required
              />
            </div>

          </div>

          {/* STATUS */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Status
            </label>

            <select
              name="_materialStatus"
              value={
                formData._materialStatus.toString()
              }
              onChange={
                handleChange
              }
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

          {/* LIVE PREVIEW */}
          <div className="p-4 border rounded bg-gray-50">
            <h3 className="font-medium mb-3">
              Live Preview
            </h3>

            <div className="flex gap-6 items-center">

              {preview && (
                <img
                  src={
                    preview
                  }
                  className="w-24 h-24 rounded border"
                />
              )}

              <div>
                <p>
                  <strong>
                    Name:
                  </strong>{" "}
                  {formData._materialName ||
                    "N/A"}
                </p>

                <p>
                  <strong>
                    Type:
                  </strong>{" "}
                  {
                    formData._materialType
                  }
                </p>

                <p>
                  <strong>
                    Price:
                  </strong>{" "}
                  {formData._materialPriceImpact
                    ? `₹${formData._materialPriceImpact}`
                    : "No Extra"}
                </p>

                <p>
                  <strong>
                    Colors:
                  </strong>{" "}
                  {formData._materialSupportColors
                    ? "Yes"
                    : "No"}
                </p>
              </div>

            </div>
          </div>

          {/* SUBMIT */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              {edit
                ? "Update Material"
                : "Submit Material"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}