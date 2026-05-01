let express=require("express")
const multer  = require('multer')
const { categoryCreate, categoryView, categoryDelete, categoryUpdate, categoryViewOne } = require("../../controller/admin/categoryController")
const { categoryChangeStatus } = require("../../controller/admin/categoryController")
const { fileUpload } = require("../../middleware/fileUpload")
// const upload = multer({ dest: 'uploads/category' })  //half control access

let storage =fileUpload("category")
let upload=multer({storage:storage})

let categoryRouter=express.Router()
//upload.single('image') single image 
//upload.field({})    multy img

categoryRouter.post("/create",upload.single('image'),categoryCreate)

categoryRouter.get("/view",categoryView)

categoryRouter.post("/delete",categoryDelete)

categoryRouter.post("/changestatus",categoryChangeStatus)

categoryRouter.put("/update/:id",upload.single('image'),categoryUpdate)

categoryRouter.get("/view/:id",categoryViewOne)

module.exports={categoryRouter}


//dest or storage ==>Where to store the files Html{crp@@}