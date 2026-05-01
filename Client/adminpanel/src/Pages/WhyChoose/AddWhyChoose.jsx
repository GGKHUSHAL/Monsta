import axios from "axios";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import React, {
  useContext,
  useEffect,
  useState
} from "react";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../MainContext";

export default function AddWhyChoose() {
  const { edit, Setedit } =
    useContext(AdminContext);

  const navigate =
    useNavigate();

  const apiBaseUrl =
    import.meta.env.VITE_APIBASEURL;

  const [formData, setFormData] =
    useState({
      _whyChooseTitle: "",
      _whyChooseDescription: "",
      _whyChooseIcon: "",
      _whyChooseOrder: "",
      _whyChooseStatus: true
    });

  const [image, setImage] =
    useState(null);

  const [preview, setPreview] =
    useState(null);

  useEffect(() => {
    if (
      edit &&
      !(
        "_whyChooseTitle" in
        edit
      )
    ) {
      Setedit(null);
    }
  }, [edit]);

  useEffect(() => {
    if (edit) {
      setFormData({
        _whyChooseTitle:
          edit._whyChooseTitle || "",
        _whyChooseDescription:
          edit._whyChooseDescription || "",
        _whyChooseIcon:
          edit._whyChooseIcon || "",
        _whyChooseOrder:
          edit._whyChooseOrder || "",
        _whyChooseStatus:
          edit._whyChooseStatus ?? true
      });

      if (edit.image) {
        const imgPath =
          localStorage.getItem(
            "whychooseImagpath"
          ) || "";

        setPreview(
          `${imgPath}${edit.image}`
        );
      }
    } else {
      setFormData({
        _whyChooseTitle: "",
        _whyChooseDescription: "",
        _whyChooseIcon: "",
        _whyChooseOrder: "",
        _whyChooseStatus: true
      });

      setImage(null);
      setPreview(null);
    }
  }, [edit]);

  const handleChange = (e) => {
    const { name, value } =
      e.target;

    setFormData({
      ...formData,
      [name]:
        name ===
        "_whyChooseStatus"
          ? value === "true"
          : value
    });
  };

  const handleImage = (e) => {
    const file =
      e.target.files[0];

    if (file) {
      setImage(file);
      setPreview(
        URL.createObjectURL(file)
      );
    }
  };

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      try {
        const fd =
          new FormData();

        fd.append(
          "_whyChooseTitle",
          formData._whyChooseTitle
        );

        fd.append(
          "_whyChooseDescription",
          formData._whyChooseDescription
        );

        fd.append(
          "_whyChooseIcon",
          formData._whyChooseIcon
        );

        fd.append(
          "_whyChooseOrder",
          formData._whyChooseOrder
        );

        fd.append(
          "_whyChooseStatus",
          formData._whyChooseStatus
        );

        if (image) {
          fd.append(
            "image",
            image
          );
        }

        // UPDATE
        if (edit) {
          const res =
            await axios.put(
              `${apiBaseUrl}why-choose-us/update/${edit._id}`,
              fd
            );

          if (
            res.data._status
          ) {
            iziToast.success({
              title: "Success",
              message:
                res.data._message,
              position:
                "topRight"
            });

            Setedit(null);

            setTimeout(() => {
              navigate(
                "/whychoose/view"
              );
            }, 1000);
          } else {
            iziToast.error({
              title: "Error",
              message:
                res.data._message,
              position:
                "topRight"
            });
          }

          return;
        }

        // CREATE
        const res =
          await axios.post(
            `${apiBaseUrl}why-choose-us/create`,
            fd
          );

        if (
          res.data._status
        ) {
          iziToast.success({
            title: "Success",
            message:
              res.data._message,
            position:
              "topRight"
          });

          setTimeout(() => {
            navigate(
              "/whychoose/view"
            );
          }, 1000);
        } else {
          iziToast.error({
            title: "Error",
            message:
              res.data._message,
            position:
              "topRight"
          });
        }
      } catch (error) {
        iziToast.error({
          title: "Error",
          message:
            error?.response
              ?.data?._message ||
            "Server Error",
          position:
            "topRight"
        });
      }
    };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg border">

        <div className="bg-blue-100 p-4 rounded-t-lg">
          <h2 className="text-xl font-semibold text-gray-800">
            {edit
              ? "Update Why Choose Us"
              : "Add Why Choose Us"}
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
                Image
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
                    Upload Image
                  </p>
                )}

                <input
                  type="file"
                  name="image"
                  onChange={
                    handleImage
                  }
                  className="mt-3 text-sm"
                />
              </div>
            </div>

            {/* RIGHT */}
            <div className="space-y-4">

              <div>
                <label className="block text-sm font-medium mb-1">
                  Title
                </label>

                <input
                  type="text"
                  name="_whyChooseTitle"
                  value={
                    formData._whyChooseTitle
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
                  Description
                </label>

                <textarea
                  rows="4"
                  name="_whyChooseDescription"
                  value={
                    formData._whyChooseDescription
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
                  Icon
                </label>

                <input
                  type="text"
                  name="_whyChooseIcon"
                  value={
                    formData._whyChooseIcon
                  }
                  onChange={
                    handleChange
                  }
                  className="w-full border rounded p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Order
                  </label>

                  <input
                    type="number"
                    name="_whyChooseOrder"
                    value={
                      formData._whyChooseOrder
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
                    name="_whyChooseStatus"
                    value={
                      formData._whyChooseStatus.toString()
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

            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              {edit
                ? "Update"
                : "Submit"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}