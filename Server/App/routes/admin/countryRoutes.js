let express = require("express")

const {
    countryCreate,
    countryView,
    countryDelete,
    countryUpdate,
    countryViewOne,
    countryChangeStatus
} = require("../../controller/admin/countryController")

let countryRouter = express.Router()

countryRouter.post("/create", countryCreate)

countryRouter.get("/view", countryView)

countryRouter.post("/delete", countryDelete)

countryRouter.post("/changestatus", countryChangeStatus)

countryRouter.put("/update/:id", countryUpdate)

countryRouter.get("/view/:id", countryViewOne)

module.exports = { countryRouter }