let express=require("express")
const multer  = require('multer')
const { subcategoryCreate, subcategoryView, getParentCategory, subcategoryDelete, subcategoryChangeStatus, subcategoryUpdate, subcategoryViewOne } = require("../../controller/admin/subcategoryController")
const { fileUpload } = require("../../middleware/fileUpload")

let storage =fileUpload("subcategory")

let upload=multer({storage:storage})

let subcategoryRouter=express.Router()

subcategoryRouter.post("/create",upload.single('image'),subcategoryCreate)

subcategoryRouter.get("/view",subcategoryView)

subcategoryRouter.get("/parent",getParentCategory)

subcategoryRouter.post("/delete",subcategoryDelete)

subcategoryRouter.post("/changestatus",subcategoryChangeStatus)

subcategoryRouter.put("/update/:id",upload.single('image'),subcategoryUpdate)

subcategoryRouter.get("/view/:id",subcategoryViewOne)

module.exports={subcategoryRouter}