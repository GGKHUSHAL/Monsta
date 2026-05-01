import axios from "axios";
import React, {
  useEffect,
  useState,
  useContext
} from "react";
import {
  FaEdit,
  FaTrash,
  FaSearch
} from "react-icons/fa";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../MainContext";

export default function ViewSlider() {
  const apiBaseUrl =
    import.meta.env.VITE_APIBASEURL;

  const navigate =
    useNavigate();

  const { Setedit } =
    useContext(AdminContext);

  const [data, setData] =
    useState([]);

  const [selected, setSelected] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const getData =
    async () => {
      try {
        let res =
          await axios.get(
            `${apiBaseUrl}slider/view`
          );

        if (
          res.data._status
        ) {
          setData(
            res.data.data
          );

          localStorage.setItem(
            "sliderImagpath",
            res.data.path
          );
        }
      } catch (error) {
        iziToast.error({
          title: "Error",
          message:
            "Failed to fetch sliders",
          position:
            "topRight"
        });
      }
    };

  useEffect(() => {
    getData();
  }, []);

  const filteredData =
    data.filter((item) =>
      item._sliderTitle
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  const handleSelect =
    (id) => {
      setSelected(
        (
          prev
        ) =>
          prev.includes(
            id
          )
            ? prev.filter(
                (
                  item
                ) =>
                  item !==
                  id
              )
            : [
                ...prev,
                id
              ]
      );
    };

  const handleSelectAll =
    () => {
      if (
        selected.length ===
        filteredData.length
      ) {
        setSelected([]);
      } else {
        setSelected(
          filteredData.map(
            (
              item
            ) =>
              item._id
          )
        );
      }
    };

  const deleteData =
    async (
      ids
    ) => {
      try {
        let confirm =
          window.confirm(
            "Delete Selected Slider?"
          );

        if (
          !confirm
        )
          return;

        let res =
          await axios.post(
            `${apiBaseUrl}slider/delete`,
            { ids }
          );

        if (
          res.data._status
        ) {
          iziToast.success(
            {
              title:
                "Success",
              message:
                res
                  .data
                  ._message,
              position:
                "topRight"
            }
          );

          getData();
          setSelected(
            []
          );
        } else {
          iziToast.error(
            {
              title:
                "Error",
              message:
                res
                  .data
                  ._message,
              position:
                "topRight"
            }
          );
        }
      } catch {
        iziToast.error({
          title: "Error",
          message:
            "Delete failed",
          position:
            "topRight"
        });
      }
    };

  const changeStatus =
    async (
      ids
    ) => {
      try {
        let res =
          await axios.post(
            `${apiBaseUrl}slider/changestatus`,
            { ids }
          );

        if (
          res.data._status
        ) {
          iziToast.success(
            {
              title:
                "Success",
              message:
                res
                  .data
                  ._message,
              position:
                "topRight"
            }
          );

          getData();
          setSelected(
            []
          );
        } else {
          iziToast.error(
            {
              title:
                "Error",
              message:
                res
                  .data
                  ._message,
              position:
                "topRight"
            }
          );
        }
      } catch {
        iziToast.error({
          title: "Error",
          message:
            "Status failed",
          position:
            "topRight"
        });
      }
    };

  const editData =
    (
      item
    ) => {
      Setedit(
        item
      );
      navigate(
        "/slider/add"
      );
    };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white border rounded-lg shadow-xl">

        {/* HEADER */}
        <div className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-t-lg flex justify-between items-center flex-wrap gap-3">

          <h2 className="text-xl font-semibold">
            View Sliders
          </h2>

          <div className="flex gap-3 flex-wrap">

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

            <button
              onClick={() =>
                deleteData(
                  selected
                )
              }
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Delete
            </button>

            <button
              onClick={() =>
                changeStatus(
                  selected
                )
              }
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Status
            </button>

          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">

            <thead className="bg-gray-100 border-b">
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
                  S.No
                </th>

                <th className="p-3">
                  Image
                </th>

                <th className="p-3">
                  Title
                </th>

                <th className="p-3">
                  Subtitle
                </th>

                <th className="p-3">
                  Button
                </th>

                <th className="p-3">
                  Link
                </th>

                <th className="p-3">
                  Order
                </th>

                <th className="p-3">
                  Status
                </th>

                <th className="p-3">
                  Action
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
                      <td className="p-3 text-center">
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
                          src={`${localStorage.getItem(
                            "sliderImagpath"
                          )}${item.image}`}
                          className="w-20 h-12 object-cover rounded border"
                        />
                      </td>

                      <td className="p-3 font-medium">
                        {
                          item._sliderTitle
                        }
                      </td>

                      <td className="p-3">
                        {
                          item._sliderSubTitle
                        }
                      </td>

                      <td className="p-3">
                        {
                          item._sliderButtonText
                        }
                      </td>

                      <td className="p-3 text-blue-600">
                        {
                          item._sliderButtonLink
                        }
                      </td>

                      <td className="p-3">
                        {
                          item._sliderOrder
                        }
                      </td>

                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded text-xs ${
                            item._sliderStatus
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {item._sliderStatus
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>

                      <td className="p-3 flex gap-3">

                        <button
                          onClick={() =>
                            editData(
                              item
                            )
                          }
                          className="text-blue-600"
                        >
                          <FaEdit />
                        </button>

                        <button
                          onClick={() =>
                            deleteData(
                              [
                                item._id
                              ]
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
                    className="text-center p-5"
                  >
                    No Data Found
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        </div>

        <div className="p-4 text-sm text-gray-600">
          Total Records :
          {
            filteredData.length
          }
        </div>

      </div>
    </div>
  );
}