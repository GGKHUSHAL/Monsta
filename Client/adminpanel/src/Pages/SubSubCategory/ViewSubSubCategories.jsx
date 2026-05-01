import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { FaEdit, FaTrash, FaSearch, FaFilter } from "react-icons/fa";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../MainContext";

export default function ViewSubSubCategory() {

  const navigate = useNavigate();
  const { Setedit } = useContext(AdminContext);
  const apiBaseUrl = import.meta.env.VITE_APIBASEURL;

  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [subSubCategories, setSubSubCategories] = useState([]);
  const [imagpath, setImagpath] = useState("");

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
  let deleteSubSubCategory = () => {
    if (selected.length === 0) {
      iziToast.warning({
        title: "Warning",
        message: "Please select at least one sub sub category",
        position: "topRight",
      });
      return;
    }

    iziToast.question({
      timeout: false,
      close: false,
      overlay: true,
      title: "Confirm",
      message: "Delete selected sub sub categories?",
      position: "center",
      buttons: [
        [
          "<button><b>Yes</b></button>",
          function (instance, toast) {
            instance.hide({}, toast);
            axios
              .post(`${apiBaseUrl}subsubcategory/delete`, { ids: selected })
              .then((res) => res.data)
              .then((finalRes) => {
                if (finalRes._status) {
                  iziToast.success({
                    title: "Success",
                    message: "Sub sub categories deleted successfully",
                    position: "topRight",
                  });
                  setSubSubCategories((prev) =>
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
  let deleteSingleSubSubCategory = (id) => {
    iziToast.question({
      timeout: false,
      close: false,
      overlay: true,
      title: "Confirm",
      message: "Delete this sub sub category?",
      position: "center",
      buttons: [
        [
          "<button><b>Yes</b></button>",
          function (instance, toast) {
            instance.hide({}, toast);
            axios
              .post(`${apiBaseUrl}subsubcategory/delete`, { ids: [id] })
              .then((res) => res.data)
              .then((finalRes) => {
                if (finalRes._status) {
                  iziToast.success({
                    title: "Deleted",
                    message: "Sub sub category deleted successfully",
                    position: "topRight",
                  });
                  setSubSubCategories((prev) =>
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

  // EDIT SUBSUBCATEGORY
  let editSubSubCategory = (id) => {
    iziToast.question({
      timeout: false,
      close: false,
      overlay: true,
      title: "Confirm",
      message: "Edit this sub sub category?",
      position: "center",
      buttons: [
        [
          "<button><b>Yes</b></button>",
          function (instance, toast) {
            instance.hide({}, toast);
            axios
              .get(`${apiBaseUrl}subsubcategory/view/${id}`)
              .then((res) => res.data)
              .then((finalRes) => {
                if (finalRes._status) {
                  const editData = Array.isArray(finalRes.data) ? finalRes.data[0] : finalRes.data;
                  Setedit(editData);
                  iziToast.success({
                    title: "Edit Mode",
                    message: "Redirecting...",
                    position: "topRight",
                  });
                  setTimeout(() => {
                    navigate("/subsubcategory/add");
                  }, 1000);
                } else {
                  iziToast.error({
                    title: "Error",
                    message: finalRes._message || "Failed to load sub sub category data",
                    position: "topRight",
                  });
                }
              })
              .catch((error) => {
                iziToast.error({
                  title: "Error",
                  message: error?.response?.data?._message || error.message || "Failed to load sub sub category",
                  position: "topRight",
                });
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
  let updateSubSubCategory = () => {
    if (selected.length === 0) {
      iziToast.warning({
        title: "Warning",
        message: "Please select at least one sub sub category to change status",
        position: "topRight",
      });
      return;
    }

    iziToast.question({
      timeout: false,
      close: false,
      overlay: true,
      title: "Confirm",
      message: "Change status for selected sub sub categories?",
      position: "center",
      buttons: [
        [
          "<button><b>Yes</b></button>",
          function (instance, toast) {
            instance.hide({}, toast);
            axios
              .post(`${apiBaseUrl}subsubcategory/changestatus`, { ids: selected })
              .then((res) => res.data)
              .then((finalRes) => {
                if (finalRes._status) {
                  iziToast.success({
                    title: "Updated",
                    message: "Status changed",
                    position: "topRight",
                  });
                  setSubSubCategories((prev) =>
                    prev.map((item) =>
                      selected.includes(item._id)
                        ? { ...item, _subsubcategoryStatus: !item._subsubcategoryStatus }
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

  const handleChangeStatus = () => {
    updateSubSubCategory();
  };

  useEffect(() => {
    axios
      .get(`${apiBaseUrl}subsubcategory/view`)
      .then((res) => res.data)
      .then((finalRes) => {
        if (finalRes._status) {
          setImagpath(finalRes.path || "");
          localStorage.setItem('subsubcategoryImagpath', finalRes.path || "");
          setSubSubCategories(finalRes.data || []);
        } else {
          iziToast.warning({
            title: "Warning",
            message: finalRes._message || "Unable to load sub sub categories",
            position: "topRight",
          });
        }
      })
      .catch(() => {
        iziToast.error({
          title: "Error",
          message: "Failed to load sub sub categories",
          position: "topRight",
        });
      });
  }, [apiBaseUrl]);

  const filteredData = subSubCategories.filter((item) =>
    (item._subsubcategoryName || item.subSubCategory || item.name || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );
  console.log(filteredData)

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Bulk Action Applied Successfully!");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <div className="bg-white border rounded-lg shadow-xl">

        {/* Header */}
        <div className="p-4 bg-linear-to-r from-purple-100 to-indigo-100 rounded-t-lg flex justify-between items-center">

          <h2 className="text-xl font-semibold">View Sub Sub Categories</h2>

          <div className="flex gap-3">

            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search sub sub category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border p-2 rounded pl-8 focus:outline-purple-400"
              />
              <FaSearch className="absolute left-2 top-3 text-gray-400" />
            </div>

            <button className="flex items-center gap-2 border px-4 py-2 rounded bg-white hover:bg-gray-50">
              <FaFilter /> Filter
            </button>

            <button onClick={() => deleteSubSubCategory()} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
              Delete Selected
            </button>

            <button
              onClick={handleChangeStatus}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Change Status
            </button>

          </div>
        </div>

        {/* Table Section */}
        <form >

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="p-3">
                    <input
                      type="checkbox"
                      checked={selected.length === filteredData.length && filteredData.length > 0}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="p-3">S.NO</th>
                  <th className="p-3">IMAGE</th>
                  <th className="p-3">NAME</th>
                  <th className="p-3">PARENT CATEGORY</th>
                  <th className="p-3">PARENT SUB CATEGORY</th>
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
                      key={item._id || item.id}
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
                          src={imagpath + item.image}
                          alt="subsubcategory"
                          className="w-16 h-16 rounded border"
                        />
                      </td>

                      <td className="p-3 font-medium">
                        {item._subsubcategoryName}
                      </td>

                      <td className="p-3">
                        {item._parentCategoryId._categoryName}

                      </td>

                      <td className="p-3">
                        {item._subcategoryId._subcategoryName}
                      </td>

                      <td className="p-3 text-gray-600">{item.slug || item._subsubcategorySlug || item.subSubCategorySlug}</td>

                      <td className="p-3">{item._subsubcategoryOrder}</td>

                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded text-xs font-semibold ${item._subsubcategoryStatus
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                            }`}
                        >
                          {item._subsubcategoryStatus ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="p-3 flex gap-4">

                        <button type="button" onClick={() => editSubSubCategory(item._id)} className="text-blue-600 hover:text-blue-800">
                          <FaEdit />
                        </button>

                        <button type="button" onClick={() => deleteSingleSubSubCategory(item._id)} className="text-red-600 hover:text-red-800">
                          <FaTrash />
                        </button>

                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center p-6 text-gray-500">
                      No Sub Sub Categories Found
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>

          {/* Footer */}
          <div className="p-4 flex justify-between items-center">

            <div className="text-sm text-gray-600">
              Total Sub Sub Categories: {filteredData.length}
            </div>

            <div className="flex gap-2">
              <button className="border px-3 py-1 rounded">Prev</button>
              <button className="border px-3 py-1 rounded bg-purple-600 text-white">
                1
              </button>
              <button className="border px-3 py-1 rounded">2</button>
              <button className="border px-3 py-1 rounded">Next</button>
            </div>

            <button
              type="submit"
              className="bg-purple-600 text-white px-5 py-2 rounded hover:bg-purple-700"
            >
              Apply Action
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}
