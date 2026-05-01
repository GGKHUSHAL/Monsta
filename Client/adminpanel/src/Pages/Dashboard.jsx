"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  FaBox,
  FaBuilding,
  FaList,
  FaLock,
  FaShoppingCart,
  FaUser,
  FaUsers,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ViewOrders from "./Order/ViewOrders";

export default function Dashboard() {
  const [showProfile, setShowProfile] = useState(false);
  const [userData, setUserData] = useState({});
  const [profileImg, setProfileImg] = useState(null);
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    categories: 0,
    orders: 0,
  });

  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_APIBASEURL;
  const token = localStorage.getItem("token");

  const getAdminData = useCallback(async () => {
    try {
      const res = await axios.post(
        `${apiBaseUrl}admin/get-data`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data._status) {
        setUserData(res.data.userData);

        if (res.data.userData.profileImage) {
          setProfileImg(res.data.path + res.data.userData.profileImage);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [apiBaseUrl, token]);

  const getDashboardStats = useCallback(async () => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const requests = [
      axios.get(`${apiBaseUrl}admin/get-admin-list`, { headers }),
      axios.get(`${apiBaseUrl}product/view`),
      axios.get(`${apiBaseUrl}category/view`),
      axios.get(`${apiBaseUrl}order/view`, { headers }),
    ];

    const [usersRes, productsRes, categoriesRes, ordersRes] =
      await Promise.allSettled(requests);

    setStats({
      users:
        usersRes.status === "fulfilled" && usersRes.value.data?._status
          ? usersRes.value.data.userData?.length || 0
          : 0,
      products:
        productsRes.status === "fulfilled" && productsRes.value.data?._status
          ? productsRes.value.data.data?.length || 0
          : 0,
      categories:
        categoriesRes.status === "fulfilled" && categoriesRes.value.data?._status
          ? categoriesRes.value.data.data?.length || 0
          : 0,
      orders:
        ordersRes.status === "fulfilled" && ordersRes.value.data?._status
          ? ordersRes.value.data.data?.length || 0
          : 0,
    });
  }, [apiBaseUrl, token]);

  useEffect(() => {
    const timer = setTimeout(() => {
      getAdminData();
      getDashboardStats();
    }, 0);
    return () => clearTimeout(timer);
  }, [getAdminData, getDashboardStats]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="relative mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-800">Dashboard</h1>
          <p className="text-gray-600">Home / Dashboard</p>
        </div>

        <div
          className="relative"
          onMouseEnter={() => setShowProfile(true)}
          onMouseLeave={() => setShowProfile(false)}
        >
          <img
            src={profileImg || "https://i.pravatar.cc/100?img=12"}
            alt="profile"
            className="h-12 w-12 cursor-pointer rounded-full border-2 border-white object-cover shadow-md"
          />

          {showProfile && (
            <div className="absolute right-0 top-full z-50 w-56 pt-0">
              <div className="h-2"></div>

              <div className="overflow-hidden rounded-md border bg-white shadow-xl">
                <div className="border-b bg-gray-50 px-4 py-2">
                  <p className="truncate text-sm font-bold text-gray-800">
                    {userData.name || "Admin"}
                  </p>
                  <p className="truncate text-xs text-gray-500">{userData.email}</p>
                </div>

                <div
                  onClick={() => navigate("/profile")}
                  className="flex cursor-pointer items-center gap-3 border-b px-4 py-3 hover:bg-gray-100"
                >
                  <FaUser className="text-gray-700" />
                  <span className="font-medium">Profile</span>
                </div>

                {userData.role === "super_admin" && (
                  <div
                    onClick={() => navigate("/company-profile")}
                    className="flex cursor-pointer items-center gap-3 border-b px-4 py-3 hover:bg-gray-100"
                  >
                    <FaBuilding className="text-gray-700" />
                    <span className="font-medium">Company Profile</span>
                  </div>
                )}

                <div
                  onClick={handleLogout}
                  className="flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-red-50"
                >
                  <FaLock className="text-red-500" />
                  <span className="font-medium text-red-500">Logout</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <hr className="mb-6 border-gray-200" />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-indigo-600 p-6 text-white shadow-lg transition hover:scale-105">
          <div className="flex items-center justify-between">
            <h2 className="text-4xl font-bold">{stats.users}</h2>
            <FaUsers size={30} />
          </div>
          <p className="mt-3 text-xl">Users</p>
        </div>

        <div className="rounded-lg bg-blue-500 p-6 text-white shadow-lg transition hover:scale-105">
          <div className="flex items-center justify-between">
            <h2 className="text-4xl font-bold">{stats.products}</h2>
            <FaBox size={30} />
          </div>
          <p className="mt-3 text-xl">Products</p>
        </div>

        <div className="rounded-lg bg-yellow-500 p-6 text-white shadow-lg transition hover:scale-105">
          <div className="flex items-center justify-between">
            <h2 className="text-4xl font-bold">{stats.categories}</h2>
            <FaList size={30} />
          </div>
          <p className="mt-3 text-xl">Categories</p>
        </div>

        <div className="rounded-lg bg-red-500 p-6 text-white shadow-lg transition hover:scale-105">
          <div className="flex items-center justify-between">
            <h2 className="text-4xl font-bold">{stats.orders}</h2>
            <FaShoppingCart size={30} />
          </div>
          <p className="mt-3 text-xl">Orders</p>
        </div>
      </div>

      <div className="mt-10">
        <ViewOrders />
      </div>
    </div>
  );
}
