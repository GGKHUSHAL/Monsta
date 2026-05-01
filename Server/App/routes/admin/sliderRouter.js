let express = require("express");
const multer = require("multer");

const {
    sliderCreate,
    sliderView,
    sliderDelete,
    sliderUpdate,
    sliderViewOne,
    sliderChangeStatus
} = require("../../controller/admin/sliderController");
const { fileUpload } = require("../../middleware/fileUpload");

// multer storage
let storage =fileUpload("slider")


let upload = multer({ storage: storage });

let sliderRouter = express.Router();

// create
sliderRouter.post(
    "/create",
    upload.single("image"),
    sliderCreate
);

// view all
sliderRouter.get(
    "/view",
    sliderView
);

// delete
sliderRouter.post(
    "/delete",
    sliderDelete
);

// status change
sliderRouter.post(
    "/changestatus",
    sliderChangeStatus
);

// update
sliderRouter.put(
    "/update/:id",
    upload.single("image"),
    sliderUpdate
);

// single view
sliderRouter.get(
    "/view/:id",
    sliderViewOne
);

module.exports = { sliderRouter };