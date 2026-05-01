"use client";
import React, { useEffect, useState } from "react";
import {
    FaPhone,
    FaEnvelope,
    FaCloudUploadAlt,
    FaArrowLeft,
    FaTrash
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

export default function Profile() {
    const [tab, setTab] = useState("edit");
    const [image, setImage] = useState(null);
    const [userData, setUserData] = useState({});
    const [gender, setGender] = useState("");
    const [subAdmins, setSubAdmins] = useState([]);

    const navigate = useNavigate();

    const apiBaseUrl = import.meta.env.VITE_APIBASEURL;
    const token = localStorage.getItem("token");

    useEffect(() => {
        getProfile();
        getSubAdmins();
    }, []);

    const getProfile = async () => {
        try {
            let res = await axios.post(
                `${apiBaseUrl}admin/get-data`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (res.data._status) {
                setUserData(res.data.userData);
                setGender(res.data.userData.gender);

                if (res.data.userData.profileImage) {
                    setImage(res.data.path + res.data.userData.profileImage);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getSubAdmins = async () => {
        try {
            let res = await axios.get(`${apiBaseUrl}admin/get-admin-list`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data._status) {
                setSubAdmins(res.data.userData);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (file) setImage(URL.createObjectURL(file));
    };

    const updateProfile = async (e) => {
        e.preventDefault();

        let formData = new FormData();
        formData.append("name", e.target.name.value);
        formData.append("email", e.target.email.value);
        formData.append("phone_number", e.target.phone.value);
        formData.append("gender", e.target.gender.value);

        if (e.target.image.files[0]) {
            formData.append("profileImage", e.target.image.files[0]);
        }

        try {
            let res = await axios.post(
                `${apiBaseUrl}admin/update-profile`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            if (res.data._status) {
                iziToast.success({
                    title: "Success",
                    message: res.data._message,
                    position: "topRight"
                });

                getProfile();
            } else {
                iziToast.error({
                    title: "Error",
                    message: res.data._message,
                    position: "topRight"
                });
            }
        } catch (error) {
            iziToast.error({
                title: "Error",
                message: "Profile update failed",
                position: "topRight"
            });
        }
    };

    const changePassword = async (e) => {
        e.preventDefault();

        let oldPassword = e.target.oldPassword.value;
        let newPassword = e.target.newPassword.value;
        let confirmPassword = e.target.confirmPassword.value;

        if (newPassword !== confirmPassword) {
            iziToast.warning({
                title: "Warning",
                message: "Password not matched",
                position: "topRight"
            });
            return;
        }

        try {
            let res = await axios.post(
                `${apiBaseUrl}admin/change-password`,
                { oldPassword, newPassword },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (res.data._status) {
                iziToast.success({
                    title: "Success",
                    message: res.data._message,
                    position: "topRight"
                });

                e.target.reset();
            } else {
                iziToast.error({
                    title: "Error",
                    message: res.data._message,
                    position: "topRight"
                });
            }
        } catch (error) {
            iziToast.error({
                title: "Error",
                message: "Password change failed",
                position: "topRight"
            });
        }
    };

    const createSubAdmin = async (e) => {
        e.preventDefault();

        let name = e.target.name.value;
        let email = e.target.email.value;
        let phone = e.target.phone.value;
        let password = e.target.password.value;
        let confirmPassword = e.target.confirmPassword.value;

        if (!name || !email || !phone || !password || !confirmPassword) {
            iziToast.error({
                title: "Error",
                message: "All fields are required",
                position: "topRight"
            });
            return;
        }

        if (password.length < 6) {
            iziToast.warning({
                title: "Warning",
                message: "Password must be minimum 6 characters",
                position: "topRight"
            });
            return;
        }

        if (password.length > 20) {
            iziToast.warning({
                title: "Warning",
                message: "Password maximum 20 characters only",
                position: "topRight"
            });
            return;
        }

        if (password !== confirmPassword) {
            iziToast.warning({
                title: "Warning",
                message: "Password and Confirm Password not matched",
                position: "topRight"
            });
            return;
        }

        try {
            let res = await axios.post(
                `${apiBaseUrl}admin/create-sub-admin`,
                {
                    name,
                    email,
                    phone_number: phone,
                    password
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (res.data._status) {
                iziToast.success({
                    title: "Success",
                    message: res.data._message,
                    position: "topRight"
                });

                e.target.reset();
                getSubAdmins();
            } else {
                iziToast.error({
                    title: "Error",
                    message: res.data._message,
                    position: "topRight"
                });
            }
        } catch (error) {
            iziToast.error({
                title: "Error",
                message: "Sub Admin create failed",
                position: "topRight"
            });
        }
    };

    const deleteSubAdmin = async (id) => {
        iziToast.question({
            timeout: false,
            close: false,
            overlay: true,
            displayMode: "once",
            zindex: 999,
            title: "Confirm",
            message: "Are you sure want to delete?",
            position: "center",

            buttons: [
                [
                    "<button>Cancel</button>",
                    function (instance, toast) {
                        instance.hide({}, toast, "button");
                    },
                    true
                ],

                [
                    "<button style='background:red;color:#fff;padding:5px 15px'>Delete</button>",
                    async function (instance, toast) {
                        instance.hide({}, toast, "button");

                        try {
                            let res = await axios.post(
                                `${apiBaseUrl}admin/delete-sub-admin`,
                                {
                                    ids: [id]   // <-- yahi main fix hai
                                },
                                {
                                    headers: {
                                        Authorization: `Bearer ${token}`
                                    }
                                }
                            );

                            if (res.data._status) {
                                iziToast.success({
                                    title: "Success",
                                    message: res.data._message,
                                    position: "topRight"
                                });

                                getSubAdmins();
                            } else {
                                iziToast.error({
                                    title: "Error",
                                    message: res.data._message,
                                    position: "topRight"
                                });
                            }

                        } catch (error) {
                            iziToast.error({
                                title: "Error",
                                message: "Delete failed",
                                position: "topRight"
                            });
                        }
                    }
                ]
            ]
        });
    };

    return (
        <div className="bg-gray-100 min-h-screen p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-semibold text-slate-700">Profile</h1>
                    <p className="text-gray-600 mt-1">Home / Profile</p>
                </div>

                <button
                    onClick={() => navigate("/")}
                    className="bg-purple-700 text-white px-5 py-2 rounded flex items-center gap-2"
                >
                    <FaArrowLeft /> Back
                </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow">
                    <div className="p-8 text-center">
                        <img
                            src={image || "https://i.pravatar.cc/100?img=12"}
                            className="w-20 h-20 rounded-full mx-auto object-cover"
                        />

                        <h2 className="mt-3 text-xl font-semibold">{userData.name}</h2>
                        <p className="text-gray-500">{userData.gender}</p>
                    </div>

                    <div className="bg-gray-100 p-6 rounded-b-lg">
                        <h3 className="font-bold mb-4">Contact Information</h3>

                        <p className="flex gap-2 items-center mb-3">
                            <FaPhone /> {userData.phone_number}
                        </p>

                        <p className="flex gap-2 items-center">
                            <FaEnvelope /> {userData.email}
                        </p>
                    </div>
                </div>

                <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
                    <div className="flex gap-6 border-b pb-3 mb-6 flex-wrap">
                        <button
                            onClick={() => setTab("edit")}
                            className={tab === "edit" ? "text-purple-700 font-bold" : ""}
                        >
                            Edit Profile
                        </button>

                        <button
                            onClick={() => setTab("password")}
                            className={tab === "password" ? "text-purple-700 font-bold" : ""}
                        >
                            Change Password
                        </button>

                        {userData.role === "super_admin" && (
                            <>
                                <button
                                    onClick={() => setTab("create")}
                                    className={tab === "create" ? "text-purple-700 font-bold" : ""}
                                >
                                    Create Sub Admin
                                </button>

                                <button
                                    onClick={() => setTab("view")}
                                    className={tab === "view" ? "text-purple-700 font-bold" : ""}
                                >
                                    View / Manage
                                </button>
                            </>
                        )}
                    </div>

                    {tab === "edit" && (
                        <form onSubmit={updateProfile} className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="border h-56 flex justify-center items-center cursor-pointer overflow-hidden">
                                    {image ? (
                                        <img
                                            src={image}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <FaCloudUploadAlt size={45} />
                                    )}

                                    <input
                                        type="file"
                                        hidden
                                        name="image"
                                        accept="image/*"
                                        onChange={handleImage}
                                    />
                                </label>

                                <button className="mt-5 bg-purple-700 text-white px-6 py-2 rounded">
                                    Update Profile
                                </button>
                            </div>

                            <div className="space-y-5">
                                <input
                                    type="text"
                                    name="name"
                                    defaultValue={userData.name}
                                    placeholder="Name"
                                    className="w-full border p-3 rounded"
                                />

                                <input
                                    type="email"
                                    name="email"
                                    defaultValue={userData.email}
                                    placeholder="Email"
                                    className="w-full border p-3 rounded"
                                />

                                <input
                                    type="text"
                                    name="phone"
                                    defaultValue={userData.phone_number}
                                    placeholder="Phone Number"
                                    className="w-full border p-3 rounded"
                                />

                                <div className="flex gap-5">
                                    {["Male", "Female", "Other"].map((g) => (
                                        <label key={g}>
                                            <input
                                                type="radio"
                                                name="gender"
                                                value={g}
                                                checked={gender === g}
                                                onChange={(e) => setGender(e.target.value)}
                                            />{" "}
                                            {g}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </form>
                    )}

                    {tab === "password" && (
                        <form onSubmit={changePassword} className="space-y-4">
                            <input
                                type="password"
                                name="oldPassword"
                                placeholder="Current Password"
                                className="w-full border p-3 rounded"
                            />

                            <input
                                type="password"
                                name="newPassword"
                                placeholder="New Password"
                                className="w-full border p-3 rounded"
                            />

                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                className="w-full border p-3 rounded"
                            />

                            <button className="bg-purple-700 text-white px-6 py-2 rounded">
                                Change Password
                            </button>
                        </form>
                    )}

                    {tab === "create" && (
                        <form onSubmit={createSubAdmin} className="space-y-4">
                            <input
                                type="text"
                                name="name"
                                placeholder="Name"
                                className="w-full border p-3 rounded"
                            />

                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                className="w-full border p-3 rounded"
                            />

                            <input
                                type="text"
                                name="phone"
                                placeholder="Phone Number"
                                className="w-full border p-3 rounded"
                            />

                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                className="w-full border p-3 rounded"
                            />

                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                className="w-full border p-3 rounded"
                            />

                            <button className="bg-purple-700 text-white px-6 py-2 rounded">
                                Create Sub Admin
                            </button>
                        </form>
                    )}

                    {tab === "view" && (
                        <div className="overflow-auto">
                            <table className="w-full border">
                                <thead className="bg-purple-700 text-white">
                                    <tr>
                                        <th className="p-3">Name</th>
                                        <th className="p-3">Email</th>
                                        <th className="p-3">Phone</th>
                                        <th className="p-3">Delete</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {subAdmins.map((item, index) => (
                                        <tr key={index} className="border-b text-center">
                                            <td className="p-3">{item.name}</td>
                                            <td className="p-3">{item.email}</td>
                                            <td className="p-3">{item.phone_number}</td>

                                            <td className="p-3">
                                                <button
                                                    onClick={() => deleteSubAdmin(item._id)}
                                                    className="text-red-600"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}

                                    {subAdmins.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="p-4 text-center">
                                                No Data Found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}