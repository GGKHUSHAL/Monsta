let express = require("express");
const { getActiveCountries } = require("../../controller/web/countryController");

let countryRoute = express.Router();

countryRoute.get("/view", getActiveCountries);

module.exports = { countryRoute };
