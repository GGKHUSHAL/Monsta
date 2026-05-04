let express = require("express");
const { checkToken } = require("../../middleware/checkToken");
const { userView } = require("../../controller/admin/userController");

let userRouter = express.Router();

userRouter.get("/view", checkToken, userView);

module.exports = { userRouter };
