import React, { useEffect, useState, useContext } from "react";
import {
  FaEdit,
  FaTrash,
  FaSearch,
  FaEye,
  FaSync,
  FaArrowLeft
} from "react-icons/fa";
import axios from "axios";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../MainContext";

export default function ViewProduct() {
  const { Setedit } = useContext(AdminContext);
  const apiBaseUrl = import.meta.env.VITE_APIBASEURL;
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    try {
      setLoading(true);

      let res = await axios.get(
        `${apiBaseUrl}product/view`
      );

      if (res.data._status) {
        setProducts(res.data.data);
      }
    } catch (error) {
      iziToast.error({
        title: "Error",
        message: "Failed to load products",
        position: "topRight"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (id) => {
    if (selected.includes(id)) {
      setSelected(
        selected.filter((item) => item !== id)
      );
    } else {
      setSelected([...selected, id]);
    }
  };

  const handleSelectAll = () => {
    if (
      selected.length === filteredData.length &&
      filteredData.length > 0
    ) {
      setSelected([]);
    } else {
      setSelected(
        filteredData.map((item) => item._id)
      );
    }
  };

  const handleDelete = async (ids) => {
    try {
      let res = await axios.post(
        `${apiBaseUrl}product/delete`,
        { ids }
      );

      if (res.data._status) {
        iziToast.success({
          title: "Success",
          message: res.data._message,
          position: "topRight"
        });

        setSelected([]);
        getProducts();
      }
    } catch (error) {
      iziToast.error({
        title: "Error",
        message: "Delete failed",
        position: "topRight"
      });
    }
  };

  const changeStatus = async () => {
    if (selected.length === 0) {
      return;
    }

    try {
      let res = await axios.post(
        `${apiBaseUrl}product/changestatus`,
        { ids: selected }
      );

      if (res.data._status) {
        setSelected([]);
        getProducts();
      }
    } catch (error) { }
  };

  const handleEdit = async (id) => {
    try {
      let res = await axios.get(
        `${apiBaseUrl}product/view/${id}`
      );

      if (res.data._status) {
        Setedit(res.data.data);
        navigate("/product/add");
      }
    } catch (error) { }
  };

  const filteredData = products.filter((item) =>
    item._productName
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-2xl shadow border overflow-hidden">

        {/* Header */}
        <div className="p-4 bg-blue-600 text-white flex flex-wrap gap-3 justify-between items-center">

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="bg-white text-blue-600 p-2 rounded"
            >
              <FaArrowLeft />
            </button>

            <h2 className="text-xl font-bold">
              Products
            </h2>
          </div>

          <div className="flex gap-2 flex-wrap">

            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="pl-8 pr-3 py-2 rounded text-black"
              />
              <FaSearch className="absolute left-2 top-3 text-gray-500 text-sm" />
            </div>

            <button
              onClick={getProducts}
              className="bg-white text-blue-600 px-3 py-2 rounded"
            >
              <FaSync />
            </button>

            <button
              onClick={changeStatus}
              className="bg-green-500 px-3 py-2 rounded"
            >
              Status
            </button>

          </div>
        </div>

        {/* Table */}
        <div className="overflow-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">
                  <input
                    type="checkbox"
                    checked={
                      selected.length ===
                      filteredData.length &&
                      filteredData.length > 0
                    }
                    onChange={handleSelectAll}
                  />
                </th>

                <th className="p-3">#</th>
                <th className="p-3">Image</th>
                <th className="p-3">Name</th>
                <th className="p-3">Price</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="8"
                    className="text-center p-5"
                  >
                    Loading...
                  </td>
                </tr>
              ) : filteredData.length > 0 ? (
                filteredData.map(
                  (item, index) => (
                    <tr
                      key={item._id}
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
                        {index + 1}
                      </td>

                      <td className="p-3">
                        <img
                          src={item.imagePath}
                          className="w-12 h-12 rounded object-cover border"
                        />
                      </td>

                      <td className="p-3 font-semibold">
                        {item._productName}
                      </td>

                      <td className="p-3">
                        ₹
                        {item._productSalePrice}
                      </td>

                      <td className="p-3">
                        {item._productStock}
                      </td>

                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded text-xs ${item._productStatus
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                            }`}
                        >
                          {item._productStatus
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>

                      <td className="p-3">
                        <div className="flex gap-3 text-lg">

                          <button
                            className="text-green-600"
                            onClick={() =>
                              navigate(
                                `/product/view/${item.slug}`
                              )
                            }
                          >
                            <FaEye />
                          </button>

                          <button
                            className="text-blue-600"
                            onClick={() =>
                              handleEdit(
                                item._id
                              )
                            }
                          >
                            <FaEdit />
                          </button>

                          <button
                            className="text-red-600"
                            onClick={() =>
                              handleDelete([
                                item._id
                              ])
                            }
                          >
                            <FaTrash />
                          </button>

                        </div>
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="text-center p-5"
                  >
                    No Product Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-gray-50 border-t text-sm">
          Total Products: {filteredData.length}
        </div>

      </div>
    </div>
  );
}