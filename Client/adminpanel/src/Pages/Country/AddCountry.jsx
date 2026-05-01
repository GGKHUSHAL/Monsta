import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import { AdminContext } from "../MainContext";

export default function AddCountry() {

    const { edit, Setedit } = useContext(AdminContext);

    useEffect(() => {
        if (edit && !("_countryName" in edit)) {
            Setedit(null);
        }
    }, [edit, Setedit]);

    const apiBaseUrl = import.meta.env.VITE_APIBASEURL;
    const navigate = useNavigate();

    const countries = [
        { name: "Afghanistan", code: "AF", phone: "+93", currency: "AFN" },
        { name: "India", code: "IN", phone: "+91", currency: "INR" },
        { name: "United States", code: "US", phone: "+1", currency: "USD" },
        { name: "United Kingdom", code: "GB", phone: "+44", currency: "GBP" },
        { name: "Australia", code: "AU", phone: "+61", currency: "AUD" },
        { name: "Canada", code: "CA", phone: "+1", currency: "CAD" },
    ];

    const [formData, setFormData] = useState({

        countryName: edit?._countryName || "",
        countryCode: edit?._countryCode || "",
        phoneCode: edit?._phoneCode || "",
        currency: edit?._currency || "",
        flag: edit?._flag || "",
        order: edit?._order || "",
        status: edit?._countryStatus ?? true

    });

    const countryOptions = countries.map((item) => ({

        label: item.name,
        value: item.name,
        code: item.code,
        phone: item.phone,
        currency: item.currency,
        flag: `https://flagcdn.com/w40/${item.code.toLowerCase()}.png`

    }));


    const handleCountrySelect = (selected) => {

        setFormData({

            ...formData,
            countryName: selected.value,
            countryCode: selected.code,
            phoneCode: selected.phone,
            currency: selected.currency,
            flag: selected.flag

        })

    }


    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData({

            ...formData,
            [name]: name === "status" ? value === "true" : value

        })

    }


    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!formData.countryName) {

            iziToast.warning({
                title: "Warning",
                message: "Please select country first",
                position: "topRight"
            });

            return;
        }

        const obj = {

            _countryName: formData.countryName,
            _countryCode: formData.countryCode,
            _phoneCode: formData.phoneCode,
            _currency: formData.currency,
            _flag: formData.flag,
            _order: formData.order,
            _status: formData.status
        };
        console.log(formData.status)

        try {

            if (edit) {

                const res = await axios.put(`${apiBaseUrl}country/update/${edit._id}`, obj);

                const finalRes = res.data;

                if (finalRes._status) {

                    iziToast.success({
                        title: "Success",
                        message: finalRes._message || "Country Updated Successfully",
                        position: "topRight"
                    });

                    Setedit(null);

                    setTimeout(() => {
                        navigate("/country/view")
                    }, 1500)

                } else {

                    iziToast.error({
                        title: "Error",
                        message: finalRes._message || "Update Failed"
                    })

                }

            } else {

                const res = await axios.post(`${apiBaseUrl}country/create`, obj);

                const finalRes = res.data;

                if (finalRes._status) {

                    iziToast.success({
                        title: "Success",
                        message: "Country Added Successfully",
                        position: "topRight"
                    });

                    setTimeout(() => {
                        navigate("/country/view")
                    }, 1500)

                } else {

                    iziToast.error({
                        title: "Error",
                        message: finalRes._message || "Something went wrong"
                    })

                }

            }

        } catch (error) {

            iziToast.error({
                title: "Error",
                message: "Server Error"
            })

        }

    }

    return (

        <div className="p-6 bg-gray-100 min-h-screen">

            <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-lg border">

                <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-t-lg">

                    <h2 className="text-xl font-semibold">
                        {edit ? "Update Country" : "Add Country"}
                    </h2>

                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">

                    <div>

                        <label className="block text-sm font-medium mb-1">
                            Search Country
                        </label>

                        <Select
                            options={countryOptions}
                            onChange={handleCountrySelect}
                            placeholder="Search country..."
                            formatOptionLabel={(country) => (
                                <div className="flex items-center gap-2">
                                    <img src={country.flag} width="20" />
                                    <span>{country.label}</span>
                                </div>
                            )}
                        />

                    </div>


                    {formData.flag && (

                        <div className="flex items-center gap-3">

                            <img
                                src={formData.flag}
                                className="w-10 border rounded"
                            />

                            <span>{formData.countryName}</span>

                        </div>

                    )}


                    <div>

                        <label className="block text-sm font-medium mb-1">
                            Country Code
                        </label>

                        <input
                            type="text"
                            value={formData.countryCode}
                            readOnly
                            className="w-full border rounded p-2 bg-gray-100"
                        />

                    </div>


                    <div>

                        <label className="block text-sm font-medium mb-1">
                            Phone Code
                        </label>

                        <input
                            type="text"
                            value={formData.phoneCode}
                            readOnly
                            className="w-full border rounded p-2 bg-gray-100"
                        />

                    </div>


                    <div>

                        <label className="block text-sm font-medium mb-1">
                            Currency
                        </label>

                        <input
                            type="text"
                            value={formData.currency}
                            readOnly
                            className="w-full border rounded p-2 bg-gray-100"
                        />

                    </div>


                    <div className="grid grid-cols-2 gap-4">

                        <div>

                            <label className="block text-sm font-medium mb-1">
                                Display Order
                            </label>

                            <input
                                type="number"
                                name="order"
                                value={formData.order}
                                onChange={handleChange}
                                className="w-full border rounded p-2"
                            />

                        </div>

                        <div>

                            <label className="block text-sm font-medium mb-1">
                                Status
                            </label>

                            <select
                                name="status"
                                value={formData.status.toString()}
                                onChange={handleChange}
                                className="w-full border rounded p-2"
                            >

                                <option value="true">Active</option>
                                <option value="false">Inactive</option>

                            </select>

                        </div>

                    </div>


                    <div className="flex justify-end">

                        <button className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700">

                            {edit ? "Update Country" : "Add Country"}

                        </button>

                    </div>

                </form>

            </div>

        </div>

    )

}