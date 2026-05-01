let express = require("express")
const multer = require('multer')
const { subsubcategoryCreate, subsubcategoryView, subsubcategoryDelete, subsubcategoryChangeStatus, subsubcategoryUpdate, subsubcategoryViewOne, getParentCategory, getParentSubCategory } = require("../../controller/admin/subsubcategoryController")
const { fileUpload } = require("../../middleware/fileUpload")

let storage =fileUpload("subsubcategory")

let upload = multer({ storage: storage })

let subsubcategoryRouter = express.Router()

subsubcategoryRouter.post("/create", upload.single('image'), subsubcategoryCreate)

subsubcategoryRouter.get("/view", subsubcategoryView)

subsubcategoryRouter.get("/parentcategory", getParentCategory)

subsubcategoryRouter.get("/parentsubcategory/:parentCategoryId", getParentSubCategory)

subsubcategoryRouter.post("/delete", subsubcategoryDelete)

subsubcategoryRouter.post("/changestatus", subsubcategoryChangeStatus)

subsubcategoryRouter.put("/update/:id", upload.single('image'), subsubcategoryUpdate)

subsubcategoryRouter.get("/view/:id", subsubcategoryViewOne)

module.exports = { subsubcategoryRouter }