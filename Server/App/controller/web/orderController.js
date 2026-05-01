const orderUseadd = require("../../model/orderModel");
const userUseadd = require("../../model/userModel");
const crypto = require("crypto");
const https = require("https");
const { transporter } = require("../../config/helper");

const normalizeItems = (items = []) =>
    items.map((item) => {
        const price = Number(item.price || 0);
        const quantity = Math.max(1, Number(item.quantity || 1));

        return {
            productId: item.productId,
            slug: item.slug,
            name: item.name,
            image: item.image,
            price,
            quantity,
            selectedColor: item.selectedColor || "",
            selectedMaterial: item.selectedMaterial || "",
            total: price * quantity
        };
    });

const formatPrice = (value) => Number(value || 0).toLocaleString("en-IN");

const sendOrderPlacedMail = async ({ userData, orderData }) => {
    const toEmail = orderData.billingAddress?.email || userData.email;
    if (!toEmail) return;

    const itemRows = orderData.items
        .map(
            (item) => `
                <tr>
                    <td style="padding:10px;border:1px solid #eee;">${item.name} x ${item.quantity}</td>
                    <td style="padding:10px;border:1px solid #eee;text-align:right;">Rs. ${formatPrice(item.total)}</td>
                </tr>
            `
        )
        .join("");

    try {
        await transporter.sendMail({
            from: '"Monsta E-COM" <khushalchoudhary116@gmail.com>',
            to: toEmail,
            bcc: "khushalchoudhary116@gmail.com",
            subject: `Order placed - ${orderData.orderNumber}`,
            html: `
                <div style="font-family:Arial,sans-serif;background:#f7f7f7;padding:24px;">
                    <div style="max-width:640px;margin:auto;background:#fff;border:1px solid #eee;">
                        <div style="background:#1f1f1f;color:#fff;padding:18px 22px;">
                            <h2 style="margin:0;">Order Placed Successfully</h2>
                        </div>
                        <div style="padding:22px;">
                            <p>Hi ${orderData.billingAddress?.name || userData.name || "Customer"},</p>
                            <p>Your order <b>${orderData.orderNumber}</b> has been placed.</p>
                            <table style="width:100%;border-collapse:collapse;margin:18px 0;">
                                ${itemRows}
                                <tr>
                                    <td style="padding:10px;border:1px solid #eee;"><b>Total</b></td>
                                    <td style="padding:10px;border:1px solid #eee;text-align:right;"><b>Rs. ${formatPrice(orderData.total)}</b></td>
                                </tr>
                            </table>
                            <p><b>Payment:</b> ${orderData.paymentMethod === "cod" ? "Cash On Delivery" : "Online"} (${orderData.paymentStatus})</p>
                            <p><b>Status:</b> ${orderData.orderStatus}</p>
                        </div>
                    </div>
                </div>
            `
        });
    } catch (error) {
        console.log("Order mail failed", error.message);
    }
};

const createOrderFromPayload = async ({
    userId,
    items,
    billingAddress,
    shippingAddress,
    orderNotes = "",
    paymentMethod = "cod",
    paymentStatus = "pending",
    discount = 0,
    razorpayOrderId = "",
    razorpayPaymentId = "",
    razorpaySignature = ""
}) => {
    const userData = await userUseadd.findOne({ _id: userId, deleted_at: null });
    if (!userData) {
        return {
            _status: false,
            _message: "User not found"
        };
    }

    const orderItems = normalizeItems(items);
    const subtotal = orderItems.reduce((total, item) => total + item.total, 0);
    const finalDiscount = Number(discount || 0);
    const total = Math.max(0, subtotal - finalDiscount);

    const orderData = await orderUseadd.create({
        userId,
        items: orderItems,
        billingAddress,
        shippingAddress: shippingAddress || billingAddress,
        orderNotes,
        paymentMethod,
        paymentStatus,
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        orderStatus: "pending",
        subtotal,
        discount: finalDiscount,
        total
    });

    await userUseadd.updateOne(
        { _id: userId },
        {
            $set: {
                billingAddress,
                ...(shippingAddress ? { shippingAddress } : {}),
                updated_at: new Date()
            }
        }
    );

    await sendOrderPlacedMail({ userData, orderData });

    return {
        _status: true,
        _message: "Order placed successfully",
        orderData
    };
};

const validateOrderPayload = ({ items = [], billingAddress }) => {
    if (!items.length) {
        return "Cart is empty";
    }

    if (!billingAddress?.name || !billingAddress?.email || !billingAddress?.mobile || !billingAddress?.address) {
        return "Billing address is required";
    }

    return "";
};

const createRazorpayApiOrder = ({ keyId, keySecret, amount }) =>
    new Promise((resolve, reject) => {
        const payload = JSON.stringify({
            amount,
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        });

        const request = https.request(
            {
                hostname: "api.razorpay.com",
                path: "/v1/orders",
                method: "POST",
                headers: {
                    Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`,
                    "Content-Type": "application/json",
                    "Content-Length": Buffer.byteLength(payload)
                },
                timeout: 20000
            },
            (response) => {
                let body = "";

                response.on("data", (chunk) => {
                    body += chunk;
                });

                response.on("end", () => {
                    let data = {};

                    try {
                        data = body ? JSON.parse(body) : {};
                    } catch (error) {
                        reject(new Error(`Invalid Razorpay response: ${body}`));
                        return;
                    }

                    if (response.statusCode >= 200 && response.statusCode < 300) {
                        resolve(data);
                        return;
                    }

                    const message =
                        data?.error?.description ||
                        data?.error?.reason ||
                        `Razorpay API failed with status ${response.statusCode}`;
                    const error = new Error(message);
                    error.code = data?.error?.code || `HTTP_${response.statusCode}`;
                    reject(error);
                });
            }
        );

        request.on("timeout", () => {
            request.destroy(new Error("Razorpay request timeout"));
        });

        request.on("error", reject);
        request.write(payload);
        request.end();
    });

const saveOrder = async (req, res) => {
    try {
        const { userId } = req.body;
        const {
            items = [],
            billingAddress,
            shippingAddress,
            orderNotes = "",
            paymentMethod = "cod",
            discount = 0
        } = req.body;

        const validationMessage = validateOrderPayload({ items, billingAddress });
        if (validationMessage) {
            return res.send({
                _status: false,
                _message: validationMessage
            });
        }

        const finalResponse = await createOrderFromPayload({
            userId,
            items,
            billingAddress,
            shippingAddress,
            orderNotes,
            paymentMethod,
            paymentStatus: paymentMethod === "cod" ? "pending" : "pending",
            discount
        });

        return res.send(finalResponse);
    } catch (error) {
        console.log("saveOrder error:", error);
        return res.send({
            _status: false,
            _message: error.message || "Something went wrong",
            _error: error.code || error.name || "ORDER_SAVE_ERROR"
        });
    }
};

const createRazorpayOrder = async (req, res) => {
    try {
        const { items = [], billingAddress, discount = 0 } = req.body;
        const validationMessage = validateOrderPayload({ items, billingAddress });

        if (validationMessage) {
            return res.send({
                _status: false,
                _message: validationMessage
            });
        }

        const keyId = String(process.env.RAZORPAY_KEY_ID || "").trim();
        const keySecret = String(process.env.RAZORPAY_KEY_SECRET || "").trim();

        if (!keyId || !keySecret || keyId === "rzp_test_your_key_id" || keySecret === "your_razorpay_secret") {
            return res.send({
                _status: false,
                _message: `Razorpay keys missing in server .env (${!keyId ? "RAZORPAY_KEY_ID " : ""}${!keySecret ? "RAZORPAY_KEY_SECRET" : ""})`
            });
        }

        const orderItems = normalizeItems(items);
        const subtotal = orderItems.reduce((total, item) => total + item.total, 0);
        const total = Math.max(0, subtotal - Number(discount || 0));
        const amount = Math.round(total * 100);

        try {
            const razorpayOrder = await createRazorpayApiOrder({
                keyId,
                keySecret,
                amount
            });

            return res.send({
                _status: true,
                _message: "Razorpay order created",
                key: keyId,
                order: razorpayOrder
            });
        } catch (error) {
            console.log("Razorpay connection error:", error);
            return res.send({
                _status: false,
                _message: `Unable to connect Razorpay: ${error.message}`,
                _error: error.code || error.name || "RAZORPAY_CONNECTION_ERROR"
            });
        }
    } catch (error) {
        console.log("createRazorpayOrder error:", error);
        return res.send({
            _status: false,
            _message: error.message || "Something went wrong",
            _error: error.code || error.name || "RAZORPAY_ORDER_ERROR"
        });
    }
};

const verifyRazorpayPayment = async (req, res) => {
    try {
        const {
            userId,
            items = [],
            billingAddress,
            shippingAddress,
            orderNotes = "",
            discount = 0,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        const validationMessage = validateOrderPayload({ items, billingAddress });
        if (validationMessage) {
            return res.send({
                _status: false,
                _message: validationMessage
            });
        }

        const keySecret = String(process.env.RAZORPAY_KEY_SECRET || "").trim();
        if (!keySecret) {
            return res.send({
                _status: false,
                _message: "Razorpay secret missing in server env"
            });
        }

        const expectedSignature = crypto
            .createHmac("sha256", keySecret)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.send({
                _status: false,
                _message: "Payment verification failed"
            });
        }

        const finalResponse = await createOrderFromPayload({
            userId,
            items,
            billingAddress,
            shippingAddress,
            orderNotes,
            paymentMethod: "online",
            paymentStatus: "paid",
            discount,
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature
        });

        return res.send(finalResponse);
    } catch (error) {
        console.log("verifyRazorpayPayment error:", error);
        return res.send({
            _status: false,
            _message: error.message || "Something went wrong",
            _error: error.code || error.name || "RAZORPAY_VERIFY_ERROR"
        });
    }
};

const getMyOrders = async (req, res) => {
    try {
        const { userId } = req.body;
        const data = await orderUseadd
            .find({ userId, deleted_at: null })
            .sort({ createdAt: -1 });

        return res.send({
            _status: true,
            _message: "Orders fetched successfully",
            data
        });
    } catch (error) {
        console.log("getMyOrders error:", error);
        return res.send({
            _status: false,
            _message: error.message || "Something went wrong",
            _error: error.code || error.name || "MY_ORDERS_ERROR"
        });
    }
};

module.exports = { saveOrder, createRazorpayOrder, verifyRazorpayPayment, getMyOrders };
