import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { FaEdit, FaTrash, FaSearch, FaFilter } from "react-icons/fa";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../MainContext";

export default function ViewCountry() {

  const navigate = useNavigate();
  const { Setedit } = useContext(AdminContext);
  const apiBaseUrl = import.meta.env.VITE_APIBASEURL;

  const [selected, setSelected] = useState([]);
  const [countries, Setcountries] = useState([]);
  const [search, setSearch] = useState("");

  // FETCH DATA
  useEffect(() => {

    axios.get(`${apiBaseUrl}country/view`)
      .then((res) => res.data)
      .then((finalRes) => {
        Setcountries(finalRes.data);
      });

  }, [selected]);



  // SELECT ONE
  const handleSelect = (id) => {

    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );

  };



  // SELECT ALL
  const handleSelectAll = () => {

    if (selected.length === countries.length) {

      setSelected([]);

    } else {

      const allIds = countries.map((item) => item._id);
      setSelected(allIds);

    }

  };



  // DELETE COUNTRY
  const deleteCountry = () => {

    if (selected.length === 0) {

      iziToast.warning({
        title: "Warning",
        message: "Please select at least one country",
      });

      return;
    }

    iziToast.question({

      timeout: false,
      close: false,
      overlay: true,
      title: "Confirm",
      message: "Are you sure you want to delete selected countries?",
      position: "center",

      buttons: [

        [

          "<button><b>Yes</b></button>",

          function (instance, toast) {

            instance.hide({}, toast);

            axios.post(`${apiBaseUrl}country/delete`, { ids: selected })
              .then((res) => res.data)
              .then((finalRes) => {

                if (finalRes._status) {

                  iziToast.success({
                    title: "Deleted",
                    message: "Country deleted successfully"
                  });

                  setSelected([]);

                }

              });

          },

          true

        ],

        ["<button>No</button>", function (instance, toast) {
          instance.hide({}, toast);
        }]

      ]

    });

  };



  // CHANGE STATUS
  const changeStatus = () => {

    if (selected.length === 0) {

      iziToast.warning({
        title: "Warning",
        message: "Please select at least one country",
      });

      return;
    }

    iziToast.question({

      timeout: false,
      close: false,
      overlay: true,
      title: "Confirm",
      message: "Change status for selected countries?",
      position: "center",

      buttons: [

        [

          "<button><b>Yes</b></button>",

          function (instance, toast) {

            instance.hide({}, toast);

            axios.post(`${apiBaseUrl}country/changestatus`, { ids: selected })
              .then((res) => res.data)
              .then((finalRes) => {

                if (finalRes._status) {

                  iziToast.success({
                    title: "Updated",
                    message: "Country status updated"
                  });

                  setSelected([]);

                }

              });

          },

          true

        ],

        ["<button>No</button>", function (instance, toast) {
          instance.hide({}, toast);
        }]

      ]

    });

  };



  // EDIT COUNTRY
  const editCountry = (id) => {

    axios.get(`${apiBaseUrl}country/view/${id}`)
      .then((res) => res.data)
      .then((finalRes) => {

        if (finalRes._status) {

          Setedit(finalRes.data);

          navigate("/country/add");

        }

      });

  };



  // SEARCH
  const filteredData = countries.filter((item) =>
    item._countryName.toLowerCase().includes(search.toLowerCase())
  );
console.log(filteredData)


  return (

    <div className="p-6 bg-gray-100 min-h-screen">

      <div className="bg-white border rounded-lg shadow-xl">

        {/* HEADER */}

        <div className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 flex justify-between items-center">

          <h2 className="text-xl font-semibold">
            View Countries
          </h2>

          <div className="flex gap-3">

            <div className="relative">

              <input
                type="text"
                placeholder="Search country..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border p-2 rounded pl-8"
              />

              <FaSearch className="absolute left-2 top-3 text-gray-400" />

            </div>

            <button
              onClick={deleteCountry}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Delete Selected
            </button>

            <button
              onClick={changeStatus}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Change Status
            </button>

          </div>

        </div>

        {/* TABLE */}

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead className="bg-gray-50 border-b">

              <tr>

                <th className="p-3">

                  <input
                    type="checkbox"
                    checked={selected.length === countries.length && countries.length > 0}
                    onChange={handleSelectAll}
                  />

                </th>

                <th className="p-3">S.NO</th>
                <th className="p-3">FLAG</th>
                <th className="p-3">COUNTRY</th>
                <th className="p-3">CODE</th>
                <th className="p-3">PHONE</th>
                <th className="p-3">CURRENCY</th>
                <th className="p-3">ORDER</th>
                <th className="p-3">STATUS</th>
                <th className="p-3">ACTION</th>

              </tr>

            </thead>

            <tbody>

              {filteredData.map((item, index) => (
                
                <tr key={item._id} className="border-b hover:bg-gray-50">

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
                      src={`https://flagcdn.com/w40/${item._countryCode.toLowerCase()}.png`}
                      className="w-8 border rounded"
                    />

                  </td>

                  <td className="p-3 font-medium">
                    {item._countryName}
                  </td>

                  <td className="p-3">{item._countryCode}</td>

                  <td className="p-3">{item._phoneCode}</td>

                  <td className="p-3">{item._currency}</td>

                  <td className="p-3">{item._order}</td>

                  <td className="p-3">

                    <span className={`px-3 py-1 rounded text-xs font-semibold ${item._status
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                      }`}>

                      {item._status ? "Active" : "Inactive"}

                    </span>

                  </td>

                  <td className="p-3 flex gap-4">

                    <button
                      onClick={() => editCountry(item._id)}
                      className="text-blue-600"
                    >
                      <FaEdit />
                    </button>

                    <button
                      onClick={deleteCountry}
                      className="text-red-600"
                    >
                      <FaTrash />
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );

}