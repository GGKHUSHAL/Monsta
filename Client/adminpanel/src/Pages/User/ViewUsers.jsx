import axios from "axios";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FaSearch } from "react-icons/fa";

export default function ViewUsers() {
  const apiBaseUrl = import.meta.env.VITE_APIBASEURL;
  const token = localStorage.getItem("token");

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const getUsers = useCallback(() => {
    axios
      .get(`${apiBaseUrl}user/view`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => res.data)
      .then((finalRes) => {
        if (finalRes._status) {
          setUsers(finalRes.data || []);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [apiBaseUrl, token]);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredData = useMemo(() => {
    const searchValue = search.toLowerCase();

    return users.filter((item) =>
      [
        item.name,
        item.email,
        item.phone_number,
        item.gender,
        item.address,
        item.billingAddress?.city,
        item.billingAddress?.state,
        item.shippingAddress?.city,
        item.shippingAddress?.state,
      ]
        .join(" ")
        .toLowerCase()
        .includes(searchValue)
    );
  }, [users, search]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="rounded-lg border bg-white shadow-xl">
        <div className="flex flex-col gap-4 bg-gradient-to-r from-purple-100 to-pink-100 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Website Users</h2>
            <p className="text-sm text-gray-600">Home / Users</p>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search user..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded border p-2 pl-8 sm:w-72"
            />
            <FaSearch className="absolute left-2 top-3 text-gray-400" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="p-3">S.NO</th>
                <th className="p-3">NAME</th>
                <th className="p-3">EMAIL</th>
                <th className="p-3">PHONE</th>
                <th className="p-3">GENDER</th>
                <th className="p-3">STATUS</th>
                <th className="p-3">ADDRESS</th>
                <th className="p-3">REGISTERED AT</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr key={item._id} className="border-b hover:bg-gray-50 align-top">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3 font-medium">{item.name || "-"}</td>
                    <td className="p-3">{item.email || "-"}</td>
                    <td className="p-3">{item.phone_number || "-"}</td>
                    <td className="p-3">{item.gender || "-"}</td>
                    <td className="p-3">
                      <span
                        className={`rounded px-3 py-1 text-xs font-semibold ${
                          item.status
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.status ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="max-w-[320px] whitespace-pre-wrap p-3 text-gray-600">
                      {item.address ||
                        item.billingAddress?.address ||
                        item.shippingAddress?.address ||
                        "-"}
                    </td>
                    <td className="p-3">
                      {item.created_at
                        ? new Date(item.created_at).toLocaleDateString()
                        : "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="p-6 text-center text-gray-500">
                    No User Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 text-sm text-gray-600">
          Total Users: {filteredData.length}
        </div>
      </div>
    </div>
  );
}
