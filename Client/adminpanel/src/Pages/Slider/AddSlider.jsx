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

export default function AddSlider() {
  const navigate =
    useNavigate();

  const apiBaseUrl =
    import.meta.env.VITE_APIBASEURL;

  const { edit, Setedit } =
    useContext(AdminContext);

  const [formData, setFormData] =
    useState({
      _sliderTitle: "",
      _sliderSubTitle: "",
      _sliderButtonText: "",
      _sliderButtonLink: "",
      _sliderOrder: "",
      _sliderStatus: true
    });

  const [image, setImage] =
    useState(null);

  const [preview, setPreview] =
    useState(null);

  // edit data fill
  useEffect(() => {
    if (edit) {
      setFormData({
        _sliderTitle:
          edit._sliderTitle ||
          "",
        _sliderSubTitle:
          edit._sliderSubTitle ||
          "",
        _sliderButtonText:
          edit._sliderButtonText ||
          "",
        _sliderButtonLink:
          edit._sliderButtonLink ||
          "",
        _sliderOrder:
          edit._sliderOrder ||
          "",
        _sliderStatus:
          edit._sliderStatus ??
          true
      });

      if (edit.image) {
        const imgPath =
          localStorage.getItem(
            "sliderImagpath"
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
              `${apiBaseUrl}slider/update/${edit._id}`,
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
                  "/slider/view"
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
            `${apiBaseUrl}slider/create`,
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
                "/slider/view"
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
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-lg border">

        {/* Header */}
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-t-lg">
          <h2 className="text-xl font-semibold text-gray-800">
            {edit
              ? "Update Slider"
              : "Add New Slider"}
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
                Slider Image
              </label>

              <div className="border rounded-lg p-4 bg-gray-50 h-72 flex flex-col justify-center items-center">

                {preview ? (
                  <img
                    src={
                      preview
                    }
                    className="h-full w-full object-cover rounded"
                  />
                ) : (
                  <p className="text-gray-500">
                    Upload Slider Image
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
                  Title
                </label>

                <input
                  type="text"
                  name="_sliderTitle"
                  value={
                    formData._sliderTitle
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
                  Sub Title
                </label>

                <textarea
                  rows="4"
                  name="_sliderSubTitle"
                  value={
                    formData._sliderSubTitle
                  }
                  onChange={
                    handleChange
                  }
                  className="w-full border rounded p-2"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Button Text
                </label>

                <input
                  type="text"
                  name="_sliderButtonText"
                  value={
                    formData._sliderButtonText
                  }
                  onChange={
                    handleChange
                  }
                  className="w-full border rounded p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Button Link
                </label>

                <input
                  type="text"
                  name="_sliderButtonLink"
                  value={
                    formData._sliderButtonLink
                  }
                  onChange={
                    handleChange
                  }
                  className="w-full border rounded p-2"
                />
              </div>

            </div>
          </div>

          {/* EXTRA */}
          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="block text-sm font-medium mb-1">
                Display Order
              </label>

              <input
                type="number"
                name="_sliderOrder"
                value={
                  formData._sliderOrder
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
                Status
              </label>

              <select
                name="_sliderStatus"
                value={
                  formData._sliderStatus.toString()
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

          </div>

          {/* LIVE PREVIEW */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="font-semibold mb-3">
              Live Preview
            </h3>

            <div className="relative h-56 rounded overflow-hidden bg-gray-200">

              {preview && (
                <img
                  src={
                    preview
                  }
                  className="absolute w-full h-full object-cover"
                />
              )}

              <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-8 text-white">
                <h2 className="text-3xl font-bold">
                  {formData._sliderTitle ||
                    "Slider Title"}
                </h2>

                <p className="mt-2 text-sm max-w-md">
                  {formData._sliderSubTitle ||
                    "Slider subtitle preview here"}
                </p>

                {formData._sliderButtonText && (
                  <button className="mt-4 bg-white text-black px-5 py-2 rounded w-fit">
                    {
                      formData._sliderButtonText
                    }
                  </button>
                )}
              </div>

            </div>
          </div>

          {/* SUBMIT */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700"
            >
              {edit
                ? "Update Slider"
                : "Submit Slider"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}