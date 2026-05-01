"use client";
import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "@/app/redux/loginSlice";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import Breadcrumbs from "@/app/common/Breadcrumbs";
import { getCountries, getMyOrders } from "@/app/services/homeServices";

export default function DashboardPage() {
    const [userData, setUserData] = useState(null);
    const [countries, setCountries] = useState([]);
    const [orders, setOrders] = useState([]);
    const [preview, setPreview] = useState(null);
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };
    const dispatch = useDispatch();
    const router = useRouter();

    const [activeTab, setActiveTab] = useState("dashboard");

    const handleLogout = () => {
        dispatch(logOut())
        router.push("/log-in");
    };

    let token = useSelector((state) => state.authStore.token);
    let apiBaseUrl = process.env.NEXT_PUBLIC_APIBASEPATH;

    const redirectToLogin = useCallback((message = "Please login first") => {
        toast.warning(message);
        setTimeout(() => {
            router.push("/log-in");
        }, 900);
    }, [router]);

    let changePassword = (e) => {
        e.preventDefault();
        if (!e.target.oldPassword.value) {
            toast.error("Current password is required");
            return;
        }
        if (!e.target.newPassword.value) {
            toast.error("New password is required");
            return;
        }
        if (!e.target.confirmPassword.value) {
            toast.error("Confirm password is required");
            return;
        }

        if (e.target.newPassword.value !== e.target.confirmPassword.value) {
            toast.error("New password and confirm password do not match");
            return;
        }

        let obj = {
            oldPassword: e.target.oldPassword.value,
            newPassword: e.target.newPassword.value
        }
        axios.post(`${apiBaseUrl}user/change-password`, obj, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => {
                if (response.data._status) {
                    toast.success(response.data._message || "Password changed successfully");
                } else {
                    toast.error(response.data._message || "Failed to change password");
                }
                e.target.reset();
            })
            .catch((error) => {
                toast.error(error.response.data._message || "Failed to change password");
            });


    }

    let getUserData = useCallback(() => {
        if (!token) {
            redirectToLogin("Please login to access dashboard");
            return;
        }

        axios.post(`${apiBaseUrl}user/get-data`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => {
                if (response.data._status) {
                    setUserData(response.data.userData);
                    setPreview(response.data.path + response.data.userData.profileImage);
                } else {
                    dispatch(logOut());
                    redirectToLogin(response.data._message || "Please login again");
                }
            })
            .catch((error) => {
                dispatch(logOut());
                redirectToLogin(error.response?.data?._message || "Please login again");
            });

    }, [apiBaseUrl, dispatch, redirectToLogin, token])

    useEffect(() => {
        getUserData()
    }, [getUserData])

    useEffect(() => {
        getCountries().then((response) => {
            if (response?._status) {
                setCountries(response.data || []);
            }
        });
    }, []);

    useEffect(() => {
        if (!token) return;

        getMyOrders(token).then((response) => {
            if (response?._status) {
                setOrders(response.data || []);
            }
        });
    }, [token]);

    let updateUser = async (e) => {
        e.preventDefault();

        let form = e.target;

        // 🔥 Validation
        if (!form.name.value) {
            toast.error("Name is required");
            return;
        }

        if (!form.address.value) {
            toast.error("Address is required");
            return;
        }

        // 🔥 FormData (image + text)
        let formData = new FormData();

        formData.append("name", form.name.value);
        formData.append("address", form.address.value);
        formData.append("gender", form.gender.value);

        if (form.image.files[0]) {
            formData.append("profileImage", form.image.files[0]); // backend name same hona chahiye
        }

        try {
            let response = await axios.post(
                `${apiBaseUrl}user/update-profile`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            if (response.data._status) {
                toast.success(response.data._message || "Profile Updated");
                getUserData(); // refresh data
            } else {
                toast.error(response.data._message || "Update failed");
            }

        } catch (error) {
            toast.error(error.response?.data?._message || "Something went wrong");
        }
    };

    let updateAddress = async (e, type) => {
        e.preventDefault();

        if (!token) {
            redirectToLogin("Please login to update address");
            return;
        }

        let form = e.target;
        let addressData = {
            name: form.name.value,
            email: form.email.value,
            mobile: form.mobile.value,
            address: form.address.value,
            country: form.country.value,
            state: form.state.value,
            city: form.city.value
        };

        let requiredFields = Object.entries(addressData).filter(([, value]) => !value);

        if (requiredFields.length > 0) {
            toast.error("Please fill all address fields");
            return;
        }

        let payload =
            type === "billing"
                ? { billingAddress: addressData }
                : { shippingAddress: addressData };

        try {
            let response = await axios.post(
                `${apiBaseUrl}user/update-addresses`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data._status) {
                toast.success(response.data._message || "Address Updated");
                getUserData();
            } else {
                toast.error(response.data._message || "Address update failed");
            }
        } catch (error) {
            toast.error(error.response?.data?._message || "Something went wrong");
        }
    };

    return (
        <div className="bg-[#f8f8f8] min-h-screen py-12">

            <div className="max-w-[1140px] mx-auto px-4">

                {/* Title */}
                <Breadcrumbs tittle="My Dashboard" />


                <div className="grid md:grid-cols-3 gap-8">

                    {/* Sidebar */}
                    <div className="space-y-3">

                        {[
                            { key: "dashboard", label: "My Dashboard" },
                            { key: "orders", label: "Orders" },
                            { key: "address", label: "Addresses" },
                            { key: "profile", label: "My Profile" },
                            { key: "password", label: "Change Password" },
                        ].map((item) => (
                            <button
                                key={item.key}
                                onClick={() => setActiveTab(item.key)}
                                className={`w-full text-left px-4 py-3 rounded-md font-medium transition
                ${activeTab === item.key
                                        ? "bg-[#c09578] text-white"
                                        : "bg-[#222] text-white hover:bg-[#c09578]"
                                    }`}
                            >
                                {item.label}
                            </button>
                        ))}

                        {/* Logout */}
                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-3 rounded-md font-medium bg-[#222] text-white hover:bg-red-500 transition"
                        >
                            Logout
                        </button>

                    </div>

                    {/* Content */}
                    <div className="md:col-span-2 bg-white p-6 rounded-lg shadow">

                        {activeTab === "dashboard" && (
                            <>
                                <h2 className="text-2xl font-semibold mb-4 text-[#000000]">
                                    My Dashboard
                                </h2>
                                <p className="text-gray-600 leading-relaxed">
                                    From your account dashboard, you can easily check & view your{" "}
                                    <span className="font-semibold">recent orders</span>, manage your{" "}
                                    <span className="font-semibold">shipping and billing addresses</span>{" "}
                                    and{" "}
                                    <span className="font-semibold">edit your password and account details</span>.
                                </p>
                            </>
                        )}

                        {activeTab === "orders" && (
                            <>
                                <h2 className="text-2xl font-semibold mb-5 text-[#2c2c2c]">
                                    Orders
                                </h2>

                                <div className="border rounded-md overflow-hidden">
                                    <table className="w-full text-sm text-left">

                                        {/* Header */}
                                        <thead className="bg-[#f3f3f3] text-[#2c2c2c]">
                                            <tr>
                                                <th className="p-3 border">Order</th>
                                                <th className="p-3 border">Date</th>
                                                <th className="p-3 border">Status</th>
                                                <th className="p-3 border">Total</th>
                                                <th className="p-3 border">Actions</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {orders.length > 0 ? (
                                                orders.map((order) => (
                                                    <tr key={order._id} className="text-[#555]">
                                                        <td className="p-3 border text-center">
                                                            {order.orderNumber || order._id}
                                                        </td>
                                                        <td className="p-3 border">
                                                            {new Date(order.createdAt).toLocaleDateString("en-IN")}
                                                        </td>
                                                        <td className="p-3 border font-medium capitalize">
                                                            {order.orderStatus}
                                                        </td>
                                                        <td className="p-3 border">
                                                            Rs. {Number(order.total || 0).toLocaleString("en-IN")} For{" "}
                                                            {order.items?.length || 0} Item
                                                        </td>
                                                        <td className="p-3 border text-[#c09578]">
                                                            {order.paymentMethod === "cod" ? "COD" : "Online"}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="5" className="p-5 text-center text-[#555]">
                                                        No orders found.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}

                        {activeTab === "address" && (
                            <div>
                                <p className="text-sm text-gray-500 mb-8 text-center">
                                    The following addresses will be used on the checkout page by default.
                                </p>

                                <div className="grid md:grid-cols-2 gap-10">
                                    {/* Billing Address Form */}
                                    <form
                                        key={`billing-${userData?._id || "guest"}-${userData?.updated_at || ""}`}
                                        onSubmit={(e) => updateAddress(e, "billing")}
                                        className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm h-[650px] overflow-y-auto"
                                    >
                                        <h3 className="text-[26px] font-semibold mb-6 text-[#2c2c2c] font-serif">
                                            Billing Address
                                        </h3>

                                        <div className="space-y-5">
                                            <div>
                                                <label className="label">Billing Name*</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    defaultValue={userData?.billingAddress?.name || userData?.name || ""}
                                                    className="inputUI"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="label">Billing Email*</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    defaultValue={userData?.billingAddress?.email || userData?.email || ""}
                                                    className="inputUI"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="label">Billing Mobile Number*</label>
                                                <input
                                                    type="text"
                                                    name="mobile"
                                                    defaultValue={userData?.billingAddress?.mobile || userData?.phone_number || ""}
                                                    className="inputUI"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="label">Billing Address*</label>
                                                <input
                                                    type="text"
                                                    name="address"
                                                    defaultValue={userData?.billingAddress?.address || userData?.address || ""}
                                                    className="inputUI"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="label">Country*</label>
                                                <select
                                                    name="country"
                                                    defaultValue={userData?.billingAddress?.country || ""}
                                                    className="inputUI"
                                                    required
                                                >
                                                    <option value="">Select Country</option>
                                                    {countries.map((country) => (
                                                        <option key={country._id} value={country._countryName}>
                                                            {country._countryName}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="label">State*</label>
                                                <input
                                                    type="text"
                                                    name="state"
                                                    defaultValue={userData?.billingAddress?.state || ""}
                                                    className="inputUI"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="label">City*</label>
                                                <input
                                                    type="text"
                                                    name="city"
                                                    defaultValue={userData?.billingAddress?.city || ""}
                                                    className="inputUI"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="text-right mt-8">
                                            <button
                                                type="submit"
                                                className="btnUI"
                                            >
                                                UPDATE
                                            </button>
                                        </div>
                                    </form>

                                    {/* Shipping Address Form */}
                                    <form
                                        key={`shipping-${userData?._id || "guest"}-${userData?.updated_at || ""}`}
                                        onSubmit={(e) => updateAddress(e, "shipping")}
                                        className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm h-[650px] overflow-y-auto"
                                    >
                                        <h3 className="text-[26px] font-semibold mb-6 text-[#2c2c2c] font-serif">
                                            Shipping Address
                                        </h3>

                                        <div className="space-y-5">
                                            <div>
                                                <label className="label">Shipping Name*</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    defaultValue={userData?.shippingAddress?.name || userData?.name || ""}
                                                    className="inputUI"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="label">Shipping Email*</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    defaultValue={userData?.shippingAddress?.email || userData?.email || ""}
                                                    className="inputUI"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="label">Shipping Mobile Number*</label>
                                                <input
                                                    type="text"
                                                    name="mobile"
                                                    defaultValue={userData?.shippingAddress?.mobile || userData?.phone_number || ""}
                                                    className="inputUI"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="label">Shipping Address*</label>
                                                <input
                                                    type="text"
                                                    name="address"
                                                    defaultValue={userData?.shippingAddress?.address || userData?.address || ""}
                                                    className="inputUI"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="label">Country*</label>
                                                <select
                                                    name="country"
                                                    defaultValue={userData?.shippingAddress?.country || ""}
                                                    className="inputUI"
                                                    required
                                                >
                                                    <option value="">Select Country</option>
                                                    {countries.map((country) => (
                                                        <option key={country._id} value={country._countryName}>
                                                            {country._countryName}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="label">State*</label>
                                                <input
                                                    type="text"
                                                    name="state"
                                                    defaultValue={userData?.shippingAddress?.state || ""}
                                                    className="inputUI"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="label">City*</label>
                                                <input
                                                    type="text"
                                                    name="city"
                                                    defaultValue={userData?.shippingAddress?.city || ""}
                                                    className="inputUI"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="text-right mt-8">
                                            <button
                                                type="submit"
                                                className="btnUI"
                                            >
                                                UPDATE
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {activeTab === "profile" && (
                            <>
                                <h2 className="text-2xl font-semibold mb-4 text-[#2c2c2c]">
                                    My Profile
                                </h2>

                                <form onSubmit={updateUser} className="border border-gray-200 rounded-md p-6 bg-white space-y-5">

                                    {/* Profile Image */}
                                    <div className="flex items-center gap-5">
                                        <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-300">
                                            {preview ? (
                                                <img src={preview} alt="Profile preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                                    No Image
                                                </div>
                                            )}
                                        </div>

                                        <input
                                            name="image"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="text-sm text-gray-600"
                                        />
                                    </div>

                                    {/* Title */}
                                    <div className="flex items-center gap-4 text-[#555]">
                                        <label className="flex items-center gap-2 text-sm">
                                            <input type="radio" name="gender" value={"Male"} defaultChecked={userData?.gender === "Male"} />
                                            Mr.
                                        </label>
                                        <label className="flex items-center gap-2 text-sm">
                                            <input type="radio" name="gender" value={"Female"} defaultChecked={userData?.gender === "Female"} />
                                            Mrs.
                                        </label>
                                        <label className="flex items-center gap-2 text-sm">
                                            <input type="radio" name="gender" value={"Other"} defaultChecked={userData?.gender === "Other"} />
                                            Other
                                        </label>
                                    </div>

                                    {/* Name */}
                                    <div>
                                        <label className="block text-sm mb-1 text-[#555]">Name*</label>
                                        <input
                                            name="name"
                                            type="text"
                                            defaultValue={userData?.name}
                                            className="w-full border text-[#000] border-gray-300 focus:border-[#c09578] focus:ring-1 focus:ring-[#c09578] rounded px-3 py-2 outline-none"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm mb-1 text-[#555]">Email*</label>
                                        <input
                                            type="email"
                                            value={userData?.email}
                                            readOnly
                                            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 text-gray-500"
                                        />
                                    </div>

                                    {/* Mobile */}
                                    <div>
                                        <label className="block text-sm mb-1 text-[#555]">Mobile Number*</label>
                                        <input
                                            type="text"
                                            value={userData?.phone_number}
                                            readOnly
                                            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 text-gray-500"
                                        />
                                    </div>

                                    {/* Address */}
                                    <div>
                                        <label className="block text-sm mb-1 text-[#555]">Address*</label>
                                        <textarea
                                            name="address"
                                            defaultValue={userData?.address}
                                            className="w-full text-[#000] border border-gray-300 focus:border-[#c09578] focus:ring-1 focus:ring-[#c09578] rounded px-3 py-2 outline-none"
                                        />
                                    </div>

                                    {/* Button */}
                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            className="bg-[#c09578] text-white px-6 py-2 rounded-full hover:bg-[#a87c5f] transition"
                                        >
                                            UPDATE
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}

                        {activeTab === "password" && (
                            <>
                                <h2 className="text-2xl font-semibold mb-5 text-[#2c2c2c] font-serif">
                                    Change Password
                                </h2>

                                <form onSubmit={changePassword} className="border border-gray-200 rounded-md p-6 bg-white space-y-6">

                                    {/* Current Password */}
                                    <div>
                                        <label className="block text-sm mb-2 text-[#555]">
                                            Current Password
                                        </label>
                                        <input
                                            name="oldPassword"
                                            type="password"
                                            className="w-full border text-[#000000] border-gray-300 px-3 py-3 rounded outline-none focus:border-[#c09578]"
                                        />
                                    </div>

                                    {/* New Password */}
                                    <div>
                                        <label className="block text-sm mb-2 text-[#555]">
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            name="newPassword"
                                            className="w-full border text-[#000000]  border-gray-300 px-3 py-3 rounded outline-none focus:border-[#c09578]"
                                        />
                                    </div>

                                    {/* Confirm Password */}
                                    <div>
                                        <label className="block text-sm mb-2 text-[#555]">
                                            Confirm Password
                                        </label>
                                        <input
                                            name="confirmPassword"
                                            type="password"
                                            className="w-full border text-[#000000] border-gray-300 px-3 py-3 rounded outline-none focus:border-[#c09578]"
                                        />
                                    </div>

                                    {/* Button */}
                                    <div className="flex justify-end pt-4">
                                        <button
                                            type="submit"
                                            className="bg-[#c09578] text-white px-7 py-3 rounded-full text-sm font-medium hover:bg-[#a87c5f] transition"
                                        >
                                            CHANGE PASSWORD
                                        </button>
                                    </div>

                                </form>
                            </>
                        )}

                    </div>

                </div>
            </div>
            <ToastContainer position="top-right" autoClose={2000} />
        </div>
    );
}

