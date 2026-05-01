let express = require("express");
const multer = require("multer");
const { fileUpload } = require("../../middleware/fileUpload");
const {
  aboutWhyChooseCreate,
  aboutWhyChooseView,
  aboutWhyChooseDelete,
  aboutWhyChooseChangeStatus,
  aboutWhyChooseUpdate,
  aboutWhyChooseViewOne
} = require("../../controller/admin/aboutWhyChooseController");

let storage = fileUpload("aboutwhychooseus");
let upload = multer({ storage });

let aboutWhyChooseRouter = express.Router();

aboutWhyChooseRouter.post("/create", upload.single("image"), aboutWhyChooseCreate);
aboutWhyChooseRouter.get("/view", aboutWhyChooseView);
aboutWhyChooseRouter.post("/delete", aboutWhyChooseDelete);
aboutWhyChooseRouter.post("/changestatus", aboutWhyChooseChangeStatus);
aboutWhyChooseRouter.put("/update/:id", upload.single("image"), aboutWhyChooseUpdate);
aboutWhyChooseRouter.get("/view/:id", aboutWhyChooseViewOne);

module.exports = { aboutWhyChooseRouter };
