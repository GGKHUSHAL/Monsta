import axios from "axios";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FaReply, FaSearch, FaTrash } from "react-icons/fa";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

export default function ViewContactQueries() {
  const apiBaseUrl = import.meta.env.VITE_APIBASEURL;

  const [queries, setQueries] = useState([]);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [replyQuery, setReplyQuery] = useState(null);
  const [replyForm, setReplyForm] = useState({
    subject: "",
    message: "",
    closeQuery: false,
  });
  const [isReplySending, setIsReplySending] = useState(false);

  const getQueries = useCallback(() => {
    axios
      .get(`${apiBaseUrl}contact-query/view`)
      .then((res) => res.data)
      .then((finalRes) => {
        if (finalRes._status) {
          setQueries(finalRes.data || []);
        }
      });
  }, [apiBaseUrl]);

  useEffect(() => {
    getQueries();
  }, [getQueries]);

  const filteredData = useMemo(() => {
    let searchValue = search.toLowerCase();

    return queries.filter((item) =>
      [item.name, item.email, item.mobile, item.subject, item.message]
        .join(" ")
        .toLowerCase()
        .includes(searchValue)
    );
  }, [queries, search]);

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

  const deleteQueries = (ids) => {
    if (ids.length === 0) {
      iziToast.warning({
        title: "Warning",
        message: "Please select at least one query",
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
      message: "Delete selected contact queries?",
      position: "center",
      buttons: [
        [
          "<button><b>Yes</b></button>",
          function (instance, toast) {
            instance.hide({}, toast);

            axios
              .post(`${apiBaseUrl}contact-query/delete`, { ids })
              .then((res) => res.data)
              .then((finalRes) => {
                if (finalRes._status) {
                  iziToast.success({
                    title: "Deleted",
                    message: "Contact query deleted successfully",
                    position: "topRight",
                  });

                  setQueries((prev) =>
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
        message: "Please select at least one query",
        position: "topRight",
      });
      return;
    }

    axios
      .post(`${apiBaseUrl}contact-query/changestatus`, { ids: selected })
      .then((res) => res.data)
      .then((finalRes) => {
        if (finalRes._status) {
          iziToast.success({
            title: "Updated",
            message: "Status changed successfully",
            position: "topRight",
          });
          setSelected([]);
          getQueries();
        }
      });
  };

  const openReplyModal = (item) => {
    setReplyQuery(item);
    setReplyForm({
      subject: item.reply_subject || `Re: ${item.subject}`,
      message:
        item.reply_message ||
        "Thank you for contacting Monsta E-COM.\n\n",
      closeQuery: false,
    });
  };

  const closeReplyModal = () => {
    setReplyQuery(null);
    setReplyForm({
      subject: "",
      message: "",
      closeQuery: false,
    });
  };

  const handleReplyChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;

    setReplyForm((prev) => ({
      ...prev,
      [e.target.name]: value,
    }));
  };

  const sendReply = (e) => {
    e.preventDefault();

    if (!replyQuery || !replyForm.subject || !replyForm.message) {
      iziToast.warning({
        title: "Warning",
        message: "Subject and message are required",
        position: "topRight",
      });
      return;
    }

    setIsReplySending(true);

    axios
      .post(`${apiBaseUrl}contact-query/reply`, {
        id: replyQuery._id,
        subject: replyForm.subject,
        message: replyForm.message,
        closeQuery: replyForm.closeQuery,
      })
      .then((res) => res.data)
      .then((finalRes) => {
        if (finalRes._status) {
          iziToast.success({
            title: "Sent",
            message: finalRes._message,
            position: "topRight",
          });
          closeReplyModal();
          getQueries();
        } else {
          iziToast.error({
            title: "Error",
            message: finalRes._message || "Mail could not be sent",
            position: "topRight",
          });
        }
      })
      .catch(() => {
        iziToast.error({
          title: "Error",
          message: "Mail could not be sent",
          position: "topRight",
        });
      })
      .finally(() => {
        setIsReplySending(false);
      });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white border rounded-lg shadow-xl">
        <div className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-xl font-semibold">Contact Queries</h2>

          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search query..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border p-2 rounded pl-8"
              />
              <FaSearch className="absolute left-2 top-3 text-gray-400" />
            </div>

            <button
              onClick={() => deleteQueries(selected)}
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
                <th className="p-3">NAME</th>
                <th className="p-3">EMAIL</th>
                <th className="p-3">MOBILE</th>
                <th className="p-3">SUBJECT</th>
                <th className="p-3">MESSAGE</th>
                <th className="p-3">STATUS</th>
                <th className="p-3">DATE</th>
                <th className="p-3">ACTION</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr key={item._id} className="border-b hover:bg-gray-50 align-top">
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selected.includes(item._id)}
                        onChange={() => handleSelect(item._id)}
                      />
                    </td>
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3 font-medium">{item.name}</td>
                    <td className="p-3">{item.email}</td>
                    <td className="p-3">{item.mobile}</td>
                    <td className="p-3 font-medium">{item.subject}</td>
                    <td className="p-3 max-w-[360px] whitespace-pre-wrap text-gray-600">
                      {item.message}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded text-xs font-semibold ${
                          item.status
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.status ? "New" : "Closed"}
                      </span>
                    </td>
                    <td className="p-3">
                      {item.created_at
                        ? new Date(item.created_at).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-4">
                        <button
                          onClick={() => openReplyModal(item)}
                          className="text-blue-600"
                          title="Reply"
                        >
                          <FaReply />
                        </button>

                      <button
                        onClick={() => deleteQueries([item._id])}
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
                  <td colSpan="10" className="text-center p-6 text-gray-500">
                    No Contact Query Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 text-sm text-gray-600">
          Total Queries: {filteredData.length}
        </div>
      </div>

      {replyQuery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-white shadow-2xl">
            <div className="border-b p-4">
              <h3 className="text-lg font-semibold">Reply Contact Query</h3>
              <p className="mt-1 text-sm text-gray-600">
                To: {replyQuery.name} ({replyQuery.email})
              </p>
            </div>

            <form onSubmit={sendReply} className="space-y-4 p-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-semibold">
                    Customer Email
                  </label>
                  <input
                    type="email"
                    value={replyQuery.email}
                    readOnly
                    className="w-full rounded border bg-gray-100 p-2"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={replyForm.subject}
                    onChange={handleReplyChange}
                    className="w-full rounded border p-2"
                  />
                </div>
              </div>

              <div className="rounded border bg-gray-50 p-3 text-sm text-gray-700">
                <p className="font-semibold">Customer Query</p>
                <p className="mt-1">
                  <span className="font-medium">Subject:</span>{" "}
                  {replyQuery.subject}
                </p>
                <p className="mt-1 whitespace-pre-wrap">{replyQuery.message}</p>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold">
                  Message
                </label>
                <textarea
                  name="message"
                  rows="7"
                  value={replyForm.message}
                  onChange={handleReplyChange}
                  className="w-full rounded border p-2"
                />
              </div>

              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <input
                  type="checkbox"
                  name="closeQuery"
                  checked={replyForm.closeQuery}
                  onChange={handleReplyChange}
                  className="h-4 w-4"
                />
                Close query after sending reply
              </label>

              <div className="flex justify-end gap-3 border-t pt-4">
                <button
                  type="button"
                  onClick={closeReplyModal}
                  className="rounded border px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isReplySending}
                  className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-70"
                >
                  {isReplySending ? "Sending..." : "Send Reply"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
