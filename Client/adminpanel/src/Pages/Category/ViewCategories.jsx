import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { FaEdit, FaTrash, FaSearch, FaFilter } from "react-icons/fa";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../MainContext";

export default function ViewCategory() {

  const navigate = useNavigate();
  const { Setedit } = useContext(AdminContext);
  const apiBaseUrl = import.meta.env.VITE_APIBASEURL;

  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [categories, SetCategories] = useState([]);

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
  let deleteCategory = () => {

    if (selected.length === 0) {

      iziToast.warning({
        title: "Warning",
        message: "Please select at least one category",
        position: "topRight",
      });

      return;
    }

    iziToast.question({
      timeout: false,
      close: false,
      overlay: true,
      title: "Confirm",
      message: "Delete selected categories?",
      position: "center",

      buttons: [

        [
          "<button><b>Yes</b></button>",
          function (instance, toast) {

            instance.hide({}, toast);

            axios
              .post(`${apiBaseUrl}category/delete`, { ids: selected })
              .then((res) => res.data)
              .then((finalRes) => {

                if (finalRes._status) {

                  iziToast.success({
                    title: "Success",
                    message: "Categories deleted successfully",
                    position: "topRight",
                  });

                  SetCategories((prev) =>
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
  let deleteSingleCategory = (id) => {

    iziToast.question({
      timeout: false,
      close: false,
      overlay: true,
      title: "Confirm",
      message: "Delete this category?",
      position: "center",

      buttons: [

        [
          "<button><b>Yes</b></button>",
          function (instance, toast) {

            instance.hide({}, toast);

            axios
              .post(`${apiBaseUrl}category/delete`, { ids: [id] })
              .then((res) => res.data)
              .then((finalRes) => {

                if (finalRes._status) {

                  iziToast.success({
                    title: "Deleted",
                    message: "Category deleted successfully",
                    position: "topRight",
                  });

                  SetCategories((prev) =>
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

  // EDIT CATEGORY
  let editCategory = (id) => {

    iziToast.question({
      timeout: false,
      close: false,
      overlay: true,
      title: "Confirm",
      message: "Edit this category?",
      position: "center",

      buttons: [

        [
          "<button><b>Yes</b></button>",
          function (instance, toast) {

            instance.hide({}, toast);

            axios
              .get(`${apiBaseUrl}category/view/${id}`)
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
                    navigate("/category/add");
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
  let updateCategory = () => {

    if (selected.length === 0) {

      iziToast.warning({
        title: "Warning",
        message: "Please select at least one category",
        position: "topRight",
      });

      return;
    }

    iziToast.question({
      timeout: false,
      close: false,
      overlay: true,
      title: "Confirm",
      message: "Change status for selected categories?",
      position: "center",

      buttons: [
        [
          "<button><b>Yes</b></button>",
          function (instance, toast) {
            instance.hide({}, toast);

            axios
              .post(`${apiBaseUrl}category/changestatus`, { ids: selected })
              .then((res) => res.data)
              .then((finalRes) => {

                if (finalRes._status) {

                  iziToast.success({
                    title: "Updated",
                    message: "Status changed",
                    position: "topRight",
                  });

                  SetCategories((prev) =>
                    prev.map((item) =>
                      selected.includes(item._id)
                        ? { ...item, _categoryStatus: !item._categoryStatus }
                        : item
                    )
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


  const [imagpath, setImagpath] = useState("");

  // GET CATEGORIES
  useEffect(() => {

    axios
      .get(`${apiBaseUrl}category/view`)
      .then((res) => res.data)
      .then((finalRes) => {
        setImagpath(finalRes.path)
        localStorage.setItem('categoryImagpath', finalRes.path);
        SetCategories(finalRes.data);

      });

  }, []);

  const filteredData = categories.filter((item) =>
    item._categoryName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <div className="bg-white border rounded-lg shadow-xl">

        {/* HEADER */}
        <div className="p-4 bg-gradient-to-r from-indigo-100 to-blue-100 rounded-t-lg flex justify-between items-center">

          <h2 className="text-xl font-semibold">View Categories</h2>

          <div className="flex gap-3">

            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border p-2 rounded pl-8 focus:outline-blue-400"
              />
              <FaSearch className="absolute left-2 top-3 text-gray-400" />
            </div>

            <button className="flex items-center gap-2 border px-4 py-2 rounded bg-white hover:bg-gray-50">
              <FaFilter /> Filter
            </button>

            <button onClick={()=>deleteCategory()} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
              Delete Selected
            </button>

            <button onClick={()=>updateCategory()} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
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
                  <th className="p-3">IMAGE</th>
                  <th className="p-3">NAME</th>
                  <th className="p-3">SLUG</th>
                  <th className="p-3">ORDER</th>
                  <th className="p-3">STATUS</th>
                  <th className="p-3">ACTION</th>
                </tr>
              </thead>

              <tbody>

                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <tr
                      key={item._id}
                      className="border-b hover:bg-gray-50 transition"
                    >

                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={selected.includes(item._id)}
                          onChange={() => handleSelect(item._id)}
                        />
                      </td>

                      <td className="p-3">{index + 1}</td>

                      <td className="p-3">
                        <img
                          src={imagpath+item.image}
                          alt="category"
                          className="w-16 h-16 rounded border"
                        />
                      </td>

                      <td className="p-3 font-medium">{item._categoryName}</td>

                      <td className="p-3 text-gray-600">{item.slug}</td>


                      <td className="p-3">{item._categoryOrder}</td>

                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded text-xs font-semibold ${
                            item._categoryStatus
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {item._categoryStatus ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="p-3 flex gap-4">

                        <button onClick={() => editCategory(item._id)} className="text-blue-600 hover:text-blue-800">
                          <FaEdit />
                        </button>

                        <button onClick={()=>deleteSingleCategory(item._id)} className="text-red-600 hover:text-red-800">
                          <FaTrash />
                        </button>

                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center p-6 text-gray-500">
                      No Categories Found
                    </td>
                  </tr>
                )}

              </tbody>
            </table>

        </div>

        <div className="p-4 text-sm text-gray-600">
          Total Categories: {filteredData.length}
        </div>

      </div>

    </div>

  );
}
