let express = require("express");
const multer = require("multer");

const {
    materialCreate,
    materialView,
    materialDelete,
    materialUpdate,
    materialViewOne,
    materialChangeStatus
} = require("../../controller/admin/materialController");
const { fileUpload } = require("../../middleware/fileUpload");

// multer storage
let storage =fileUpload("material")

let upload = multer({ storage: storage });

let materialRouter = express.Router();

// create
materialRouter.post(
    "/create",
    upload.single("image"),
    materialCreate
);

// view all
materialRouter.get(
    "/view",
    materialView
);

// delete
materialRouter.post(
    "/delete",
    materialDelete
);

// status change
materialRouter.post(
    "/changestatus",
    materialChangeStatus
);

// update
materialRouter.put(
    "/update/:id",
    upload.single("image"),
    materialUpdate
);

// single view
materialRouter.get(
    "/view/:id",
    materialViewOne
);

module.exports = { materialRouter };