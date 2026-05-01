let express = require("express");
const multer = require("multer");

const {
    testimonialCreate,
    testimonialView,
    testimonialDelete,
    testimonialUpdate,
    testimonialViewOne,
    testimonialChangeStatus
} = require("../../controller/admin/testimonialController");
const { fileUpload } = require("../../middleware/fileUpload");

// multer storage
let storage =fileUpload("testimonial")


let upload = multer({ storage: storage });

let testimonialRouter = express.Router();

// create
testimonialRouter.post(
    "/create",
    upload.single("image"),
    testimonialCreate
);

// view all
testimonialRouter.get("/view", testimonialView);

// delete
testimonialRouter.post("/delete", testimonialDelete);

// status change
testimonialRouter.post(
    "/changestatus",
    testimonialChangeStatus
);

// update
testimonialRouter.put(
    "/update/:id",
    upload.single("image"),
    testimonialUpdate
);

// single view
testimonialRouter.get(
    "/view/:id",
    testimonialViewOne
);

module.exports = { testimonialRouter };