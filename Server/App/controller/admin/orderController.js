const orderUseadd = require("../../model/orderModel");
const { transporter } = require("../../config/helper");

const formatPrice = (value) => Number(value || 0).toLocaleString("en-IN");

const sendStatusChangeMail = async ({ order, orderStatus, paymentStatus }) => {
    const email = order.billingAddress?.email || order.userId?.email;
    if (!email) return;

    const statusLines = [
        orderStatus ? `<p><b>Order Status:</b> ${orderStatus}</p>` : "",
        paymentStatus ? `<p><b>Payment Status:</b> ${paymentStatus}</p>` : ""
    ].join("");

    try {
        await transporter.sendMail({
            from: '"Monsta E-COM" <khushalchoudhary116@gmail.com>',
            to: email,
            subject: `Order status updated - ${order.orderNumber}`,
            html: `
                <div style="font-family:Arial,sans-serif;background:#f7f7f7;padding:24px;">
                    <div style="max-width:620px;margin:auto;background:#fff;border:1px solid #eee;">
                        <div style="background:#1f1f1f;color:#fff;padding:18px 22px;">
                            <h2 style="margin:0;">Order Status Updated</h2>
                        </div>
                        <div style="padding:22px;">
                            <p>Hi ${order.billingAddress?.name || order.userId?.name || "Customer"},</p>
                            <p>Your order <b>${order.orderNumber}</b> has been updated.</p>
                            ${statusLines}
                            <p><b>Total:</b> Rs. ${formatPrice(order.total)}</p>
                        </div>
                    </div>
                </div>
            `
        });
    } catch (error) {
        console.log("Order status mail failed", error.message);
    }
};

const getOrders = async (req, res) => {
    try {
        const data = await orderUseadd
            .find({ deleted_at: null })
            .populate("userId", "name email phone_number")
            .sort({ createdAt: -1 });

        return res.send({
            _status: true,
            _message: "Orders fetched successfully",
            data
        });
    } catch (error) {
        console.log(error);
        return res.send({
            _status: false,
            _message: "Something went wrong"
        });
    }
};

const getOrderById = async (req, res) => {
    try {
        const data = await orderUseadd
            .findOne({ _id: req.params.id, deleted_at: null })
            .populate("userId", "name email phone_number");

        if (!data) {
            return res.send({
                _status: false,
                _message: "Order not found"
            });
        }

        return res.send({
            _status: true,
            _message: "Order fetched successfully",
            data
        });
    } catch (error) {
        console.log(error);
        return res.send({
            _status: false,
            _message: "Something went wrong"
        });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { orderStatus, paymentStatus } = req.body;
        const updateObj = {};

        if (orderStatus) updateObj.orderStatus = orderStatus;
        if (paymentStatus) updateObj.paymentStatus = paymentStatus;

        if (!Object.keys(updateObj).length) {
            return res.send({
                _status: false,
                _message: "No status selected"
            });
        }

        const order = await orderUseadd
            .findOne({ _id: req.params.id, deleted_at: null })
            .populate("userId", "name email phone_number");

        if (!order) {
            return res.send({
                _status: false,
                _message: "Order not found"
            });
        }

        const updateRes = await orderUseadd.updateOne(
            { _id: req.params.id, deleted_at: null },
            { $set: updateObj }
        );

        await sendStatusChangeMail({
            order,
            orderStatus,
            paymentStatus
        });

        return res.send({
            _status: true,
            _message: "Order updated successfully and mail sent",
            updateRes
        });
    } catch (error) {
        console.log(error);
        return res.send({
            _status: false,
            _message: "Something went wrong"
        });
    }
};

const orderManagePage = async (req, res) => {
    try {
        const data = await orderUseadd
            .find({ deleted_at: null })
            .populate("userId", "name email phone_number")
            .sort({ createdAt: -1 });

        const rows = data
            .map((order) => {
                const customerName =
                    order.billingAddress?.name || order.userId?.name || "Customer";
                const customerEmail =
                    order.billingAddress?.email || order.userId?.email || "";

                return `
                    <tr>
                        <td>${order.orderNumber || order._id}</td>
                        <td>${customerName}<br/><small>${customerEmail}</small></td>
                        <td>${order.items?.length || 0}</td>
                        <td>Rs. ${formatPrice(order.total)}</td>
                        <td>${order.paymentMethod === "cod" ? "COD" : "Online"}<br/><small>${order.paymentStatus}</small></td>
                        <td>
                            <select data-id="${order._id}" data-type="orderStatus">
                                ${["pending", "processing", "shipped", "completed", "cancelled"]
                                    .map(
                                        (status) =>
                                            `<option value="${status}" ${order.orderStatus === status ? "selected" : ""}>${status}</option>`
                                    )
                                    .join("")}
                            </select>
                        </td>
                        <td>
                            <select data-id="${order._id}" data-type="paymentStatus">
                                ${["pending", "paid", "failed"]
                                    .map(
                                        (status) =>
                                            `<option value="${status}" ${order.paymentStatus === status ? "selected" : ""}>${status}</option>`
                                    )
                                    .join("")}
                            </select>
                        </td>
                        <td>${new Date(order.createdAt).toLocaleString("en-IN")}</td>
                    </tr>
                `;
            })
            .join("");

        return res.send(`
            <!doctype html>
            <html>
                <head>
                    <title>Orders</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 24px; background: #f7f7f7; }
                        table { width: 100%; border-collapse: collapse; background: #fff; }
                        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; vertical-align: top; }
                        th { background: #1f1f1f; color: #fff; }
                        select { padding: 8px; min-width: 130px; }
                        .notice { margin-bottom: 14px; color: #0f766e; font-weight: 700; }
                    </style>
                </head>
                <body>
                    <h1>Orders</h1>
                    <p class="notice" id="notice"></p>
                    <table>
                        <thead>
                            <tr>
                                <th>Order</th>
                                <th>Customer</th>
                                <th>Items</th>
                                <th>Total</th>
                                <th>Payment</th>
                                <th>Order Status</th>
                                <th>Payment Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>${rows || `<tr><td colspan="8">No orders found.</td></tr>`}</tbody>
                    </table>
                    <script>
                        document.querySelectorAll("select").forEach((select) => {
                            select.addEventListener("change", async (event) => {
                                const id = event.target.dataset.id;
                                const type = event.target.dataset.type;
                                const body = { [type]: event.target.value };
                                const response = await fetch("/admin/order/manage-update/" + id, {
                                    method: "PUT",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify(body)
                                });
                                const data = await response.json();
                                document.getElementById("notice").textContent = data._message || "Updated";
                            });
                        });
                    </script>
                </body>
            </html>
        `);
    } catch (error) {
        console.log(error);
        return res.status(500).send("Something went wrong");
    }
};

module.exports = { getOrders, getOrderById, updateOrderStatus, orderManagePage };
