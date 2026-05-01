let express = require("express");
const multer = require("multer");

const {
    createadmin,
    loginadmin,
    getAdminData,
    changePassword,
    resetPassword,
    forgotPassword,
    updateProfile,
    getAdminDataList,
    deleteAdmin
} = require("../../controller/web/adminController");
const { fileUpload } = require("../../middleware/fileUpload");
const { checkToken } = require("../../middleware/checkToken");

let storage =fileUpload("adminprofile")


let upload = multer({ storage: storage });

let adminRouter = express.Router();

adminRouter.post("/create-sub-admin", checkToken, createadmin);

adminRouter.post("/login", loginadmin);

adminRouter.post("/change-password", checkToken, changePassword);

adminRouter.post("/reset-password", resetPassword);

adminRouter.post("/forgot-password", forgotPassword);

adminRouter.post("/get-data", checkToken, getAdminData);

adminRouter.get("/get-admin-list", checkToken, getAdminDataList);

adminRouter.post("/delete-sub-admin", checkToken, deleteAdmin);

/*
OLD:
upload.single("profileImage")

NEW:
2 image fields support
1 = profileImage
2 = company_logo
*/

adminRouter.post(
    "/update-profile",
    checkToken,
    upload.fields([
        { name: "profileImage", maxCount: 1 },
        { name: "company_logo", maxCount: 1 }
    ]),
    updateProfile
);

module.exports = { adminRouter };
