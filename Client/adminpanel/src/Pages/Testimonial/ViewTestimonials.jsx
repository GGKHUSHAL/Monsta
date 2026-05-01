import axios from "axios";
import React, {
  useContext,
  useEffect,
  useState
} from "react";
import {
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter
} from "react-icons/fa";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../MainContext";

export default function ViewTestimonials() {
  const navigate = useNavigate();
  const { Setedit } =
    useContext(AdminContext);

  const apiBaseUrl =
    import.meta.env.VITE_APIBASEURL;

  const [selected, setSelected] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [testimonials, setTestimonials] =
    useState([]);

  const [imagpath, setImagpath] =
    useState("");

  // ==========================
  // GET DATA
  // ==========================
  useEffect(() => {
    axios
      .get(
        `${apiBaseUrl}testimonial/view`
      )
      .then((res) => res.data)
      .then((finalRes) => {
        if (finalRes._status) {
          setTestimonials(
            finalRes.data
          );

          setImagpath(
            finalRes.path
          );

          localStorage.setItem(
            "testimonialImagpath",
            finalRes.path
          );
        }
      });
  }, [apiBaseUrl]);

  // ==========================
  // FILTER
  // ==========================
  const filteredData =
    testimonials.filter((item) =>
      `${item._testimonialName || ""} ${item._testimonialDesignation || ""}`
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  // ==========================
  // SELECT ALL
  // ==========================
  const handleSelectAll = () => {
    if (
      selected.length ===
      filteredData.length
    ) {
      setSelected([]);
    } else {
      setSelected(
        filteredData.map(
          (item) => item._id
        )
      );
    }
  };

  // ==========================
  // SELECT ONE
  // ==========================
  const handleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter(
          (item) =>
            item !== id
        )
        : [...prev, id]
    );
  };

  // ==========================
  // DELETE MULTI
  // ==========================
  const deleteAll = () => {
    if (selected.length === 0) {
      iziToast.warning({
        title: "Warning",
        message:
          "Please select at least one testimonial",
        position:
          "topRight"
      });

      return;
    }

    iziToast.question({
      timeout: false,
      close: false,
      overlay: true,
      title: "Confirm",
      message:
        "Delete selected testimonials?",
      position: "center",

      buttons: [
        [
          "<button><b>Yes</b></button>",
          function (
            instance,
            toast
          ) {
            instance.hide(
              {},
              toast
            );

            axios
              .post(
                `${apiBaseUrl}testimonial/delete`,
                {
                  ids: selected
                }
              )
              .then(
                (res) =>
                  res.data
              )
              .then(
                (
                  finalRes
                ) => {
                  if (
                    finalRes._status
                  ) {
                    iziToast.success(
                      {
                        title:
                          "Deleted",
                        message:
                          "Testimonials deleted",
                        position:
                          "topRight"
                      }
                    );

                    setTestimonials(
                      (
                        prev
                      ) =>
                        prev.filter(
                          (
                            item
                          ) =>
                            !selected.includes(
                              item._id
                            )
                        )
                    );

                    setSelected(
                      []
                    );
                  }
                }
              );
          },
          true
        ],
        [
          "<button>Cancel</button>",
          function (
            instance,
            toast
          ) {
            instance.hide(
              {},
              toast
            );
          }
        ]
      ]
    });
  };

  // ==========================
  // DELETE SINGLE
  // ==========================
  const deleteOne = (id) => {
    iziToast.question({
      timeout: false,
      close: false,
      overlay: true,
      title: "Confirm",
      message:
        "Delete this testimonial?",
      position: "center",

      buttons: [
        [
          "<button><b>Yes</b></button>",
          function (
            instance,
            toast
          ) {
            instance.hide(
              {},
              toast
            );

            axios
              .post(
                `${apiBaseUrl}testimonial/delete`,
                {
                  ids: [id]
                }
              )
              .then(
                (res) =>
                  res.data
              )
              .then(
                (
                  finalRes
                ) => {
                  if (
                    finalRes._status
                  ) {
                    iziToast.success(
                      {
                        title:
                          "Deleted",
                        message:
                          "Testimonial deleted",
                        position:
                          "topRight"
                      }
                    );

                    setTestimonials(
                      (
                        prev
                      ) =>
                        prev.filter(
                          (
                            item
                          ) =>
                            item._id !==
                            id
                        )
                    );
                  }
                }
              );
          },
          true
        ],
        [
          "<button>Cancel</button>",
          function (
            instance,
            toast
          ) {
            instance.hide(
              {},
              toast
            );
          }
        ]
      ]
    });
  };

  // ==========================
  // EDIT
  // ==========================
  const editData = (id) => {
    axios
      .get(
        `${apiBaseUrl}testimonial/view/${id}`
      )
      .then((res) => res.data)
      .then((finalRes) => {
        if (finalRes._status) {
          Setedit(
            finalRes.data
          );

          navigate(
            "/testimonial/add"
          );
        }
      });
  };

  // ==========================
  // STATUS CHANGE
  // ==========================

  const changeStatus = () => {
    if (selected.length === 0) {
      iziToast.warning({
        title: "Warning",
        message: "Please select at least one testimonial",
        position: "topRight"
      });
      return;
    }

    iziToast.question({
      timeout: false,
      close: false,
      overlay: true,
      title: "Confirm",
      message: "Change status of selected testimonials?",
      position: "center",

      buttons: [
        [
          "<button><b>Yes</b></button>",
          function (instance, toast) {
            instance.hide({}, toast);

            axios
              .post(
                `${apiBaseUrl}testimonial/changestatus`,
                {
                  ids: selected
                }
              )
              .then((res) => res.data)
              .then((finalRes) => {
                if (finalRes._status) {
                  iziToast.success({
                    title: "Success",
                    message: finalRes._message,
                    position: "topRight"
                  });

                  setTestimonials((prev) =>
                    prev.map((item) =>
                      selected.includes(item._id)
                        ? {
                          ...item,
                          _testimonialStatus:
                            !item._testimonialStatus
                        }
                        : item
                    )
                  );

                  setSelected([]);
                } else {
                  iziToast.error({
                    title: "Error",
                    message: finalRes._message,
                    position: "topRight"
                  });
                }
              });
          },
          true
        ],

        [
          "<button>No</button>",
          function (instance, toast) {
            instance.hide({}, toast);
          }
        ]
      ]
    });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white border rounded-lg shadow-xl">

        {/* HEADER */}
        <div className="p-4 bg-gradient-to-r from-indigo-100 to-blue-100 rounded-t-lg flex justify-between items-center">

          <h2 className="text-xl font-semibold">
            View Testimonials
          </h2>

          <div className="flex gap-3">

            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={
                  search
                }
                onChange={(
                  e
                ) =>
                  setSearch(
                    e.target
                      .value
                  )
                }
                className="border p-2 rounded pl-8"
              />

              <FaSearch className="absolute left-2 top-3 text-gray-400" />
            </div>

            <button className="flex items-center gap-2 border px-4 py-2 rounded bg-white">
              <FaFilter /> Filter
            </button>

            <button
              onClick={
                deleteAll
              }
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Delete Selected
            </button>

            <button
              onClick={
                changeStatus
              }
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Change Status
            </button>

          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">

            <thead className="border-b bg-gray-50">
              <tr>
                <th className="p-3">
                  <input
                    type="checkbox"
                    checked={
                      selected.length ===
                      filteredData.length &&
                      filteredData.length >
                      0
                    }
                    onChange={
                      handleSelectAll
                    }
                  />
                </th>

                <th className="p-3">
                  S.NO
                </th>

                <th className="p-3">
                  IMAGE
                </th>

                <th className="p-3">
                  NAME
                </th>

                <th className="p-3">
                  JOB TITLE
                </th>

                <th className="p-3">
                  MESSAGE
                </th>

                <th className="p-3">
                  RATING
                </th>

                <th className="p-3">
                  ORDER
                </th>

                <th className="p-3">
                  STATUS
                </th>

                <th className="p-3">
                  ACTION
                </th>
              </tr>
            </thead>

            <tbody>

              {filteredData.length >
                0 ? (
                filteredData.map(
                  (
                    item,
                    index
                  ) => (
                    <tr
                      key={
                        item._id
                      }
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={selected.includes(
                            item._id
                          )}
                          onChange={() =>
                            handleSelect(
                              item._id
                            )
                          }
                        />
                      </td>

                      <td className="p-3">
                        {index +
                          1}
                      </td>

                      <td className="p-3">
                        <img
                          src={`${imagpath}${item.image}`}
                          className="w-16 h-16 rounded border object-cover"
                        />
                      </td>

                      <td className="p-3 font-medium">
                        {
                          item._testimonialName
                        }
                      </td>

                      <td className="p-3">
                        {
                          item._testimonialDesignation || "-"
                        }
                      </td>

                      <td className="p-3 max-w-xs">
                        {
                          item._testimonialMessage
                        }
                      </td>

                      <td className="p-3">
                        {
                          item._testimonialRating
                        }
                      </td>

                      <td className="p-3">
                        {
                          item._testimonialOrder
                        }
                      </td>

                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded text-xs font-semibold ${item._testimonialStatus
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                            }`}
                        >
                          {item._testimonialStatus
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>

                      <td className="p-3 flex gap-4">
                        <button
                          onClick={() =>
                            editData(
                              item._id
                            )
                          }
                          className="text-blue-600"
                        >
                          <FaEdit />
                        </button>

                        <button
                          onClick={() =>
                            deleteOne(
                              item._id
                            )
                          }
                          className="text-red-600"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan="10"
                    className="text-center p-6 text-gray-500"
                  >
                    No Testimonials Found
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        </div>

        {/* FOOTER */}
        <div className="p-4 text-sm text-gray-600">
          Total Testimonials:{" "}
          {
            filteredData.length
          }
        </div>

      </div>
    </div>
  );
}
