let express = require("express");
const { checkToken } = require("../../middleware/checkToken");
const {
    getOrders,
    getOrderById,
    updateOrderStatus,
    orderManagePage
} = require("../../controller/admin/orderController");

let orderRouter = express.Router();

orderRouter.get("/manage", orderManagePage);
orderRouter.put("/manage-update/:id", updateOrderStatus);
orderRouter.get("/view", checkToken, getOrders);
orderRouter.get("/view/:id", checkToken, getOrderById);
orderRouter.put("/update-status/:id", checkToken, updateOrderStatus);

module.exports = { orderRouter };
