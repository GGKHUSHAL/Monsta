let express = require("express");
const {
  contactQueryCreate,
} = require("../../controller/admin/contactQueryController");

let contactQueryRoute = express.Router();

contactQueryRoute.post("/create", contactQueryCreate);

module.exports = { contactQueryRoute };
