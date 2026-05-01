let express=require("express")
const { colorCreate, colorView, colorDelete, colorUpdate, colorViewOne } = require("../../controller/admin/colorController")
const { colorChangeStatus } = require("../../controller/admin/colorController")

let colorRouter=express.Router()

colorRouter.post("/create",colorCreate)

colorRouter.get("/view",colorView)

colorRouter.post("/delete",colorDelete)

colorRouter.post("/changestatus",colorChangeStatus)

colorRouter.put("/update/:id",colorUpdate)

colorRouter.get("/view/:id",colorViewOne)

module.exports={colorRouter}