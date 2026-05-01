let express = require("express");
const {
  newsletterView,
  newsletterDelete,
  newsletterChangeStatus,
  newsletterSendMail,
} = require("../../controller/admin/newsletterController");

let newsletterRouter = express.Router();

newsletterRouter.get("/view", newsletterView);
newsletterRouter.post("/delete", newsletterDelete);
newsletterRouter.post("/changestatus", newsletterChangeStatus);
newsletterRouter.post("/send-mail", newsletterSendMail);

module.exports = { newsletterRouter };
