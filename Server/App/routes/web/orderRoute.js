let express = require("express");
const { checkToken } = require("../../middleware/checkToken");
const {
    saveOrder,
    createRazorpayOrder,
    verifyRazorpayPayment,
    getMyOrders
} = require("../../controller/web/orderController");

let orderRoute = express.Router();

orderRoute.post("/place-order", checkToken, saveOrder);
orderRoute.post("/create-razorpay-order", checkToken, createRazorpayOrder);
orderRoute.post("/verify-razorpay-payment", checkToken, verifyRazorpayPayment);
orderRoute.get("/my-orders", checkToken, getMyOrders);

module.exports = { orderRoute };
