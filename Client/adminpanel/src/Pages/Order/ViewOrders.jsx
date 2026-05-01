import axios from "axios";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FaSearch, FaSyncAlt } from "react-icons/fa";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const orderStatusOptions = ["pending", "processing", "shipped", "completed", "cancelled"];
const paymentStatusOptions = ["pending", "paid", "failed"];

const formatPrice = (value) => Number(value || 0).toLocaleString("en-IN");

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
});

export default function ViewOrders() {
  const apiBaseUrl = import.meta.env.VITE_APIBASEURL;
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState("");

  const fetchOrders = useCallback(() => {
    setLoading(true);

    axios
      .get(`${apiBaseUrl}order/view`, {
        headers: getAuthHeaders(),
      })
      .then((res) => res.data)
      .then((finalRes) => {
        if (finalRes._status) {
          setOrders(finalRes.data || []);
          return;
        }

        iziToast.error({
          title: "Error",
          message: finalRes._message || "Unable to fetch orders",
          position: "topRight",
        });
      })
      .catch((error) => {
        iziToast.error({
          title: "Error",
          message: error.response?.data?._message || "Unable to fetch orders",
          position: "topRight",
        });
      })
      .finally(() => setLoading(false));
  }, [apiBaseUrl]);

  useEffect(() => {
    const timer = setTimeout(fetchOrders, 0);
    return () => clearTimeout(timer);
  }, [fetchOrders]);

  const filteredOrders = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    if (!keyword) return orders;

    return orders.filter((order) => {
      const customerName =
        order.billingAddress?.name || order.userId?.name || "";
      const customerEmail =
        order.billingAddress?.email || order.userId?.email || "";

      return [
        order.orderNumber,
        customerName,
        customerEmail,
        order.orderStatus,
        order.paymentStatus,
        order.paymentMethod,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(keyword));
    });
  }, [orders, search]);

  const updateStatus = (orderId, field, value) => {
    setUpdatingId(`${orderId}-${field}`);

    axios
      .put(
        `${apiBaseUrl}order/update-status/${orderId}`,
        { [field]: value },
        {
          headers: getAuthHeaders(),
        }
      )
      .then((res) => res.data)
      .then((finalRes) => {
        if (finalRes._status) {
          setOrders((current) =>
            current.map((order) =>
              order._id === orderId
                ? {
                    ...order,
                    [field]: value,
                  }
                : order
            )
          );

          iziToast.success({
            title: "Updated",
            message: finalRes._message || "Status updated and mail sent",
            position: "topRight",
          });
          return;
        }

        iziToast.error({
          title: "Error",
          message: finalRes._message || "Status update failed",
          position: "topRight",
        });
      })
      .catch((error) => {
        iziToast.error({
          title: "Error",
          message: error.response?.data?._message || "Status update failed",
          position: "topRight",
        });
      })
      .finally(() => setUpdatingId(""));
  };

  return (
    <div className="bg-white border rounded-lg shadow-xl">
      <div className="flex flex-col gap-4 border-b p-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Orders</h1>
          <p className="text-sm text-gray-500">
            Manage order status and payment status. Every status change sends an email to the customer.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchOrders}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded bg-gray-900 px-4 py-2 text-white disabled:opacity-60"
        >
          <FaSyncAlt className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-sm">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search order, customer, status..."
            className="w-full rounded border p-2 pl-9 outline-none focus:border-purple-500"
          />
        </div>

        <div className="text-sm font-semibold text-gray-600">
          Total Orders: {filteredOrders.length}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] text-left text-sm">
          <thead className="border-y bg-gray-50 text-gray-700">
            <tr>
              <th className="p-3">Order</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Items</th>
              <th className="p-3">Total</th>
              <th className="p-3">Payment</th>
              <th className="p-3">Order Status</th>
              <th className="p-3">Payment Status</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => {
                const customerName =
                  order.billingAddress?.name || order.userId?.name || "Customer";
                const customerEmail =
                  order.billingAddress?.email || order.userId?.email || "";
                const customerMobile =
                  order.billingAddress?.mobile || order.userId?.phone_number || "";

                return (
                  <tr key={order._id} className="border-b align-top hover:bg-gray-50">
                    <td className="p-3 font-semibold text-gray-800">
                      {order.orderNumber || order._id}
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-gray-800">{customerName}</div>
                      <div className="text-xs text-gray-500">{customerEmail}</div>
                      <div className="text-xs text-gray-500">{customerMobile}</div>
                    </td>
                    <td className="p-3">
                      <div className="space-y-1">
                        {(order.items || []).map((item, index) => (
                          <div key={`${order._id}-${index}`} className="text-gray-700">
                            {item.name} x {item.quantity}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="p-3 font-semibold">
                      Rs. {formatPrice(order.total)}
                    </td>
                    <td className="p-3 capitalize">
                      {order.paymentMethod === "cod" ? "COD" : "Online"}
                    </td>
                    <td className="p-3">
                      <select
                        value={order.orderStatus || "pending"}
                        disabled={updatingId === `${order._id}-orderStatus`}
                        onChange={(event) =>
                          updateStatus(order._id, "orderStatus", event.target.value)
                        }
                        className="rounded border px-3 py-2 capitalize outline-none focus:border-purple-500 disabled:opacity-60"
                      >
                        {orderStatusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3">
                      <select
                        value={order.paymentStatus || "pending"}
                        disabled={updatingId === `${order._id}-paymentStatus`}
                        onChange={(event) =>
                          updateStatus(order._id, "paymentStatus", event.target.value)
                        }
                        className="rounded border px-3 py-2 capitalize outline-none focus:border-purple-500 disabled:opacity-60"
                      >
                        {paymentStatusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3 text-gray-600">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleString("en-IN")
                        : "-"}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" className="p-8 text-center text-gray-500">
                  {loading ? "Loading orders..." : "No orders found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
