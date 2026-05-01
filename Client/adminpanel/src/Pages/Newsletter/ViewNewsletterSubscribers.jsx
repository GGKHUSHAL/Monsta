import axios from "axios";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FaEnvelope, FaSearch, FaTrash } from "react-icons/fa";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

export default function ViewNewsletterSubscribers() {
  const apiBaseUrl = import.meta.env.VITE_APIBASEURL;

  const [subscribers, setSubscribers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [mailModalOpen, setMailModalOpen] = useState(false);
  const [sendToAll, setSendToAll] = useState(false);
  const [mailForm, setMailForm] = useState({
    subject: "",
    message: "",
  });
  const [isSending, setIsSending] = useState(false);

  const getSubscribers = useCallback(() => {
    axios
      .get(`${apiBaseUrl}newsletter/view`)
      .then((res) => res.data)
      .then((finalRes) => {
        if (finalRes._status) {
          setSubscribers(finalRes.data || []);
        }
      });
  }, [apiBaseUrl]);

  useEffect(() => {
    getSubscribers();
  }, [getSubscribers]);

  const filteredData = useMemo(() => {
    let searchValue = search.toLowerCase();

    return subscribers.filter((item) =>
      [item.email, item.last_mail_subject]
        .join(" ")
        .toLowerCase()
        .includes(searchValue)
    );
  }, [subscribers, search]);

  const handleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(filteredData.map((item) => item._id));
      return;
    }

    setSelected([]);
  };

  const deleteSubscribers = (ids) => {
    if (ids.length === 0) {
      iziToast.warning({
        title: "Warning",
        message: "Please select at least one subscriber",
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
      message: "Delete selected subscribers?",
      position: "center",
      buttons: [
        [
          "<button><b>Yes</b></button>",
          function (instance, toast) {
            instance.hide({}, toast);

            axios
              .post(`${apiBaseUrl}newsletter/delete`, { ids })
              .then((res) => res.data)
              .then((finalRes) => {
                if (finalRes._status) {
                  iziToast.success({
                    title: "Deleted",
                    message: "Subscribers deleted successfully",
                    position: "topRight",
                  });

                  setSubscribers((prev) =>
                    prev.filter((item) => !ids.includes(item._id))
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

  const updateStatus = () => {
    if (selected.length === 0) {
      iziToast.warning({
        title: "Warning",
        message: "Please select at least one subscriber",
        position: "topRight",
      });
      return;
    }

    axios
      .post(`${apiBaseUrl}newsletter/changestatus`, { ids: selected })
      .then((res) => res.data)
      .then((finalRes) => {
        if (finalRes._status) {
          iziToast.success({
            title: "Updated",
            message: "Status changed successfully",
            position: "topRight",
          });
          setSelected([]);
          getSubscribers();
        }
      });
  };

  const openMailModal = (allUsers = false, ids = selected) => {
    if (!allUsers && ids.length === 0) {
      iziToast.warning({
        title: "Warning",
        message: "Please select subscribers or choose Send All",
        position: "topRight",
      });
      return;
    }

    setSelected(ids);
    setSendToAll(allUsers);
    setMailForm({
      subject: "New Arrivals and Special Offers at Monsta E-COM",
      message:
        "Hello,\n\nDiscover our latest furniture arrivals, fresh home styling ideas, and special offers curated for your space.\n\nShop beautiful designs and bring comfort home with Monsta E-COM.",
    });
    setMailModalOpen(true);
  };

  const closeMailModal = () => {
    setMailModalOpen(false);
    setSendToAll(false);
    setMailForm({
      subject: "",
      message: "",
    });
  };

  const handleMailChange = (e) => {
    setMailForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const sendNewsletterMail = (e) => {
    e.preventDefault();

    if (!mailForm.subject || !mailForm.message) {
      iziToast.warning({
        title: "Warning",
        message: "Subject and message are required",
        position: "topRight",
      });
      return;
    }

    setIsSending(true);

    axios
      .post(`${apiBaseUrl}newsletter/send-mail`, {
        ids: selected,
        sendToAll,
        subject: mailForm.subject,
        message: mailForm.message,
      })
      .then((res) => res.data)
      .then((finalRes) => {
        if (finalRes._status) {
          iziToast.success({
            title: "Sent",
            message: finalRes._message,
            position: "topRight",
          });
          setSelected([]);
          closeMailModal();
          getSubscribers();
        } else {
          iziToast.error({
            title: "Error",
            message: finalRes._message || "Newsletter mail could not be sent",
            position: "topRight",
          });
        }
      })
      .catch(() => {
        iziToast.error({
          title: "Error",
          message: "Newsletter mail could not be sent",
          position: "topRight",
        });
      })
      .finally(() => {
        setIsSending(false);
      });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white border rounded-lg shadow-xl">
        <div className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <h2 className="text-xl font-semibold">Newsletter Subscribers</h2>

          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border p-2 rounded pl-8"
              />
              <FaSearch className="absolute left-2 top-3 text-gray-400" />
            </div>

            <button
              onClick={() => openMailModal(false)}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Mail Selected
            </button>

            <button
              onClick={() => openMailModal(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded"
            >
              Mail All
            </button>

            <button
              onClick={() => deleteSubscribers(selected)}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Delete Selected
            </button>

            <button
              onClick={updateStatus}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Change Status
            </button>
          </div>
        </div>

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
                <th className="p-3">EMAIL</th>
                <th className="p-3">STATUS</th>
                <th className="p-3">SUBSCRIBED AT</th>
                <th className="p-3">LAST MAIL</th>
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
                    <td className="p-3 font-medium">{item.email}</td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded text-xs font-semibold ${
                          item.status
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.status ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-3">
                      {item.created_at
                        ? new Date(item.created_at).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="p-3">
                      {item.last_mail_subject || "-"}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-4">
                        <button
                          onClick={() => {
                            openMailModal(false, [item._id]);
                          }}
                          className="text-blue-600"
                          title="Send Mail"
                        >
                          <FaEnvelope />
                        </button>

                        <button
                          onClick={() => deleteSubscribers([item._id])}
                          className="text-red-600"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center p-6 text-gray-500">
                    No Newsletter Subscriber Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 text-sm text-gray-600">
          Total Subscribers: {filteredData.length}
        </div>
      </div>

      {mailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-white shadow-2xl">
            <div className="border-b p-4">
              <h3 className="text-lg font-semibold">Send Newsletter Mail</h3>
              <p className="mt-1 text-sm text-gray-600">
                {sendToAll
                  ? "Sending to all active newsletter subscribers"
                  : `Sending to ${selected.length} selected subscriber(s)`}
              </p>
            </div>

            <form onSubmit={sendNewsletterMail} className="space-y-4 p-4">
              <div>
                <label className="mb-1 block text-sm font-semibold">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={mailForm.subject}
                  onChange={handleMailChange}
                  className="w-full rounded border p-2"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold">
                  Message
                </label>
                <textarea
                  name="message"
                  rows="8"
                  value={mailForm.message}
                  onChange={handleMailChange}
                  className="w-full rounded border p-2"
                />
              </div>

              <div className="flex justify-end gap-3 border-t pt-4">
                <button
                  type="button"
                  onClick={closeMailModal}
                  className="rounded border px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSending}
                  className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-70"
                >
                  {isSending ? "Sending..." : "Send Mail"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
