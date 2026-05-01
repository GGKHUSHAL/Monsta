let express = require("express");
const {
  newsletterSubscribe,
  newsletterUnsubscribe,
} = require("../../controller/admin/newsletterController");

let newsletterRoute = express.Router();

newsletterRoute.post("/subscribe", newsletterSubscribe);
newsletterRoute.post("/unsubscribe", newsletterUnsubscribe);

module.exports = { newsletterRoute };
