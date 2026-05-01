import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../MainContext";

export default function ViewFAQ() {

  const navigate = useNavigate();
  const { Setedit } = useContext(AdminContext);
  const apiBaseUrl = import.meta.env.VITE_APIBASEURL;

  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [faqs, Setfaqs] = useState([]);

  // SELECT SINGLE
  const handleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  // SELECT ALL
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(filteredData.map((item) => item._id));
    } else {
      setSelected([]);
    }
  };

  // MULTI DELETE
  const deleteFAQ = () => {

    if (selected.length === 0) {
      iziToast.warning({
        title: "Warning",
        message: "Please select at least one FAQ",
        position: "topRight",
      });
      return;
    }

    iziToast.question({
      timeout: false,
      close: false,
      overlay: true,
      displayMode: "once",
      title: "Confirm",
      message: "Delete selected FAQs?",
      position: "center",

      buttons: [

        [
          "<button><b>Yes</b></button>",
          function (instance, toast) {

            instance.hide({}, toast);

            axios
              .post(`${apiBaseUrl}faq/delete`, { ids: selected })
              .then((res) => res.data)
              .then((finalRes) => {

                if (finalRes._status) {

                  iziToast.success({
                    title: "Deleted",
                    message: "FAQs deleted successfully",
                    position: "topRight",
                  });

                  Setfaqs((prev) =>
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
  const deleteSingleFAQ = (id) => {

    iziToast.question({
      timeout: false,
      close: false,
      overlay: true,
      displayMode: "once",
      title: "Confirm",
      message: "Delete this FAQ?",
      position: "center",

      buttons: [

        [
          "<button><b>Yes</b></button>",
          function (instance, toast) {

            instance.hide({}, toast);

            axios
              .post(`${apiBaseUrl}faq/delete`, { ids: [id] })
              .then((res) => res.data)
              .then((finalRes) => {

                if (finalRes._status) {

                  iziToast.success({
                    title: "Deleted",
                    message: "FAQ deleted successfully",
                    position: "topRight",
                  });

                  Setfaqs((prev) =>
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

  // EDIT FAQ
  const editFAQ = (id) => {

    iziToast.question({
      timeout: false,
      close: false,
      overlay: true,
      displayMode: "once",
      title: "Confirm",
      message: "Edit this FAQ?",
      position: "center",

      buttons: [

        [
          "<button><b>Yes</b></button>",
          function (instance, toast) {

            instance.hide({}, toast);

            axios
              .get(`${apiBaseUrl}faq/view/${id}`)
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
                    navigate("/faq/add");
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
  const updateFAQ = () => {

    if (selected.length === 0) {
      iziToast.warning({
        title: "Warning",
        message: "Select at least one FAQ",
        position: "topRight",
      });
      return;
    }

    iziToast.question({
      timeout: false,
      close: false,
      overlay: true,
      title: "Confirm",
      message: "Change status for selected FAQs?",
      position: "center",

      buttons: [
        [
          "<button><b>Yes</b></button>",
          function (instance, toast) {
            instance.hide({}, toast);

            axios
              .post(`${apiBaseUrl}faq/changestatus`, { ids: selected })
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

  // GET FAQ
  useEffect(() => {

    axios
      .get(`${apiBaseUrl}faq/view`)
      .then((res) => res.data)
      .then((finalRes) => {

        Setfaqs(finalRes.data);

      });

  }, [selected]);

  const filteredData = faqs.filter((item) =>
    item._faqQuestion.toLowerCase().includes(search.toLowerCase())
  );

  return (

    <div className="p-6 bg-gray-100 min-h-screen">

      <div className="bg-white border rounded-lg shadow-xl">

        {/* HEADER */}

        <div className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 flex justify-between items-center">

          <h2 className="text-xl font-semibold">View FAQ</h2>

          <div className="flex gap-3">

            <div className="relative">

              <input
                type="text"
                placeholder="Search FAQ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border p-2 rounded pl-8"
              />

              <FaSearch className="absolute left-2 top-3 text-gray-400" />

            </div>

            <button
              onClick={deleteFAQ}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Delete Selected
            </button>

            <button
              onClick={updateFAQ}
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
                    onChange={handleSelectAll}
                    checked={
                      filteredData.length > 0 &&
                      selected.length === filteredData.length
                    }
                  />

                </th>

                <th className="p-3">S.NO</th>
                <th className="p-3">QUESTION</th>
                <th className="p-3">ANSWER</th>
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

                    <td className="p-3 font-medium">{item._faqQuestion}</td>

                    <td className="p-3 text-gray-600">
                      {item._faqAnswere}
                    </td>

                    <td className="p-3">{item._faqOrder}</td>

                    <td className="p-3">

                      <span
                        className={`px-3 py-1 rounded text-xs font-semibold ${
                          item._faqStatus
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item._faqStatus ? "Active" : "Inactive"}
                      </span>

                    </td>

                    <td className="p-3 flex gap-4">

                      <button
                        onClick={() => editFAQ(item._id)}
                        className="text-blue-600"
                      >
                        <FaEdit />
                      </button>

                      <button
                        onClick={() => deleteSingleFAQ(item._id)}
                        className="text-red-600"
                      >
                        <FaTrash />
                      </button>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td colSpan="7" className="text-center p-6 text-gray-500">
                    No FAQ Found
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

        <div className="p-4 text-sm text-gray-600">
          Total FAQs: {filteredData.length}
        </div>

      </div>

    </div>

  );
}