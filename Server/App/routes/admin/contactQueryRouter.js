let express = require("express");
const {
  contactQueryView,
  contactQueryViewOne,
  contactQueryDelete,
  contactQueryChangeStatus,
  contactQueryReply,
} = require("../../controller/admin/contactQueryController");

let contactQueryRouter = express.Router();

contactQueryRouter.get("/view", contactQueryView);
contactQueryRouter.get("/view/:id", contactQueryViewOne);
contactQueryRouter.post("/delete", contactQueryDelete);
contactQueryRouter.post("/changestatus", contactQueryChangeStatus);
contactQueryRouter.post("/reply", contactQueryReply);

module.exports = { contactQueryRouter };
