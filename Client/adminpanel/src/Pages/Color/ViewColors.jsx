import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { FaEdit, FaTrash, FaSearch, FaFilter } from "react-icons/fa";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../MainContext";

export default function ViewColors() {

  const navigate = useNavigate();
  const { Setedit } = useContext(AdminContext);
  const apiBaseUrl = import.meta.env.VITE_APIBASEURL;

  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [colors, Setcolors] = useState([]);

  // SELECT ALL
  const handleSelectAll = () => {
    if (selected.length === filteredData.length) {
      setSelected([]);
    } else {
      const allIds = filteredData.map((item) => item._id);
      setSelected(allIds);
    }
  };

  // SELECT SINGLE
  const handleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  // MULTI DELETE
  let deletecolor = () => {

    if (selected.length === 0) {

      iziToast.warning({
        title: "Warning",
        message: "Please select at least one color",
        position: "topRight",
      });

      return;
    }

    iziToast.question({
      timeout: false,
      close: false,
      overlay: true,
      title: "Confirm",
      message: "Delete selected colors?",
      position: "center",

      buttons: [

        [
          "<button><b>Yes</b></button>",
          function (instance, toast) {

            instance.hide({}, toast);

            axios
              .post(`${apiBaseUrl}color/delete`, { ids: selected })
              .then((res) => res.data)
              .then((finalRes) => {

                if (finalRes._status) {

                  iziToast.success({
                    title: "Success",
                    message: "Colors deleted successfully",
                    position: "topRight",
                  });

                  Setcolors((prev) =>
                    prev.filter((item) => !selected.includes(item._id))
                  );

                  setSelected([]);

                }

              });

          },
          true,
        ],

        [
          "<button>Cancel</button>",
          function (instance, toast) {
            instance.hide({}, toast);
          },
        ],

      ],

    });

  };

  // SINGLE DELETE
  let deleteSingleColor = (id) => {

    iziToast.question({
      timeout: false,
      close: false,
      overlay: true,
      title: "Confirm",
      message: "Delete this color?",
      position: "center",

      buttons: [

        [
          "<button><b>Yes</b></button>",
          function (instance, toast) {

            instance.hide({}, toast);

            axios
              .post(`${apiBaseUrl}color/delete`, { ids: [id] })
              .then((res) => res.data)
              .then((finalRes) => {

                if (finalRes._status) {

                  iziToast.success({
                    title: "Deleted",
                    message: "Color deleted successfully",
                    position: "topRight",
                  });

                  Setcolors((prev) =>
                    prev.filter((item) => item._id !== id)
                  );

                }

              });

          },
          true,
        ],

        [
          "<button>Cancel</button>",
          function (instance, toast) {
            instance.hide({}, toast);
          },
        ],

      ],

    });

  };

  // EDIT COLOR
  let editColor = (id) => {

    iziToast.question({
      timeout: false,
      close: false,
      overlay: true,
      title: "Confirm",
      message: "Edit this color?",
      position: "center",

      buttons: [

        [
          "<button><b>Yes</b></button>",
          function (instance, toast) {

            instance.hide({}, toast);

            axios
              .get(`${apiBaseUrl}color/view/${id}`)
              .then((res) => res.data)
              .then((finalRes) => {

                if (finalRes._status) {

                  Setedit(finalRes.data);

                  iziToast.success({
                    title: "Edit Mode",
                    message: "Redirecting...",
                    position: "topRight",
                  });

                  setTimeout(() => {
                    navigate("/color/add");
                  }, 1000);

                }

              });

          },
          true,
        ],

        [
          "<button>Cancel</button>",
          function (instance, toast) {
            instance.hide({}, toast);
          },
        ],

      ],

    });

  };

  // STATUS CHANGE
  let updateColor = () => {

    if (selected.length === 0) {

      iziToast.warning({
        title: "Warning",
        message: "Please select at least one color",
        position: "topRight",
      });

      return;
    }

    iziToast.question({
      timeout: false,
      close: false,
      overlay: true,
      title: "Confirm",
      message: "Change status for selected colors?",
      position: "center",

      buttons: [
        [
          "<button><b>Yes</b></button>",
          function (instance, toast) {
            instance.hide({}, toast);

            axios
              .post(`${apiBaseUrl}color/changestatus`, { ids: selected })
              .then((res) => res.data)
              .then((finalRes) => {

                if (finalRes._status) {

                  iziToast.success({
                    title: "Updated",
                    message: "Status changed",
                    position: "topRight",
                  });

                  setSelected([]);

                }

              });
          },
          true,
        ],

        [
          "<button>Cancel</button>",
          function (instance, toast) {
            instance.hide({}, toast);
          },
        ],
      ],
    });

  };

  // GET COLORS
  useEffect(() => {

    axios
      .get(`${apiBaseUrl}color/view`)
      .then((res) => res.data)
      .then((finalRes) => {

        Setcolors(finalRes.data);

      });

  }, []);

  const filteredData = colors.filter((item) =>
    item._colorName.toLowerCase().includes(search.toLowerCase())
  );

  return (

    <div className="p-6 bg-gray-100 min-h-screen">

      <div className="bg-white border rounded-lg shadow-xl">

        {/* HEADER */}

        <div className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 flex justify-between items-center">

          <h2 className="text-xl font-semibold">View Colors</h2>

          <div className="flex gap-3">

            <div className="relative">

              <input
                type="text"
                placeholder="Search color..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border p-2 rounded pl-8"
              />

              <FaSearch className="absolute left-2 top-3 text-gray-400" />

            </div>

            <button className="flex items-center gap-2 border px-4 py-2 rounded bg-white">
              <FaFilter /> Filter
            </button>

            <button
              onClick={deletecolor}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Delete Selected
            </button>

            <button
              onClick={updateColor}
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
                      selected.length === filteredData.length &&
                      filteredData.length > 0
                    }
                    onChange={handleSelectAll}
                  />

                </th>

                <th className="p-3">S.NO</th>
                <th className="p-3">COLOR NAME</th>
                <th className="p-3">PREVIEW</th>
                <th className="p-3">CODE</th>
                <th className="p-3">TYPE</th>
                <th className="p-3">ORDER</th>
                <th className="p-3">STATUS</th>
                <th className="p-3">ACTION</th>

              </tr>

            </thead>

            <tbody>

              {filteredData.length > 0 ? (

                filteredData.map((item, index) => (

                  <tr key={item._id} className="border-b hover:bg-gray-50">

                    <td className="p-3">

                      <input
                        type="checkbox"
                        checked={selected.includes(item._id)}
                        onChange={() => handleSelect(item._id)}
                      />

                    </td>

                    <td className="p-3">{index + 1}</td>

                    <td className="p-3 font-medium">{item._colorName}</td>

                    <td className="p-3">

                      <div
                        className="w-12 h-8 border rounded"
                        style={{ background: item._colorCode }}
                      ></div>

                    </td>

                    <td className="p-3">{item._colorCode}</td>

                    <td className="p-3">{item._colorType}</td>

                    <td className="p-3">{item._colorOrder}</td>

                    <td className="p-3">

                      <span
                        className={`px-3 py-1 rounded text-xs font-semibold ${
                          item._colorStatus
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item._colorStatus ? "Active" : "Inactive"}
                      </span>

                    </td>

                    <td className="p-3 flex gap-4">

                      <button
                        onClick={() => editColor(item._id)}
                        className="text-blue-600"
                      >
                        <FaEdit />
                      </button>

                      <button
                        onClick={() => deleteSingleColor(item._id)}
                        className="text-red-600"
                      >
                        <FaTrash />
                      </button>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td colSpan="9" className="text-center p-6 text-gray-500">
                    No Colors Found
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

        <div className="p-4 text-sm text-gray-600">
          Total Colors: {filteredData.length}
        </div>

      </div>

    </div>

  );
}