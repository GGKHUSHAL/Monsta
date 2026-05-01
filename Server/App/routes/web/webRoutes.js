let express = require("express")
const { authRoute } = require("./authRoutes")
const { homeRoute } = require("./homeRoutes")
const { contactQueryRoute } = require("./contactQueryRoutes")
const { newsletterRoute } = require("./newsletterRoutes")
const { orderRoute } = require("./orderRoute")
const { countryRoute } = require("./countryRoute")


let webRoute = express.Router()  //API create

webRoute.use("/user",authRoute)

webRoute.use("/home",homeRoute)

webRoute.use("/contact-query",contactQueryRoute)

webRoute.use("/newsletter",newsletterRoute)

webRoute.use("/order", orderRoute)

webRoute.use("/country", countryRoute)

module.exports = {webRoute}
