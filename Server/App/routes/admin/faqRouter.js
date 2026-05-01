let express=require("express")
const { faqCreate, faqView, faqDelete, faqUpdate, faqViewOne } = require("../../controller/admin/faqController")
const { faqChangeStatus } = require("../../controller/admin/faqController")

let faqRouter=express.Router()

faqRouter.post("/create",faqCreate)

faqRouter.get("/view",faqView)

faqRouter.post("/delete",faqDelete)

faqRouter.post("/changestatus",faqChangeStatus)

faqRouter.put("/update/:id",faqUpdate)

faqRouter.get("/view/:id",faqViewOne)

module.exports={faqRouter}