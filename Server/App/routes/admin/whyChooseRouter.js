let express = require("express");
const multer = require("multer");

const {
    whyChooseCreate,
    whyChooseView,
    whyChooseDelete,
    whyChooseUpdate,
    whyChooseViewOne,
    whyChooseChangeStatus
} = require("../../controller/admin/whyChooseController");
const { fileUpload } = require("../../middleware/fileUpload");

// multer storage
let storage =fileUpload("whychooseus")


let upload = multer({ storage: storage });

let whyChooseRouter = express.Router();

// create
whyChooseRouter.post(
    "/create",
    upload.single("image"),
    whyChooseCreate
);

// view all
whyChooseRouter.get(
    "/view",
    whyChooseView
);

// delete
whyChooseRouter.post(
    "/delete",
    whyChooseDelete
);

// status change
whyChooseRouter.post(
    "/changestatus",
    whyChooseChangeStatus
);

// update
whyChooseRouter.put(
    "/update/:id",
    upload.single("image"),
    whyChooseUpdate
);

// single view
whyChooseRouter.get(
    "/view/:id",
    whyChooseViewOne
);

module.exports = { whyChooseRouter };