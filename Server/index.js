const mongoose = require('mongoose');
let express = require("express")
let App = express()
let cors = require("cors")
const path = require("path")
const { adminCreate } = require('./App/config/helper');
const { webRoute } = require('./App/routes/web/webRoutes');
const { adminRoute } = require('./App/routes/web/adminRoutes');
App.use(cors())
App.use(express.json())
require("dotenv").config({ path: path.join(__dirname, ".env") })

const getMongoUri = () => {
    const fallbackDbName = process.env.MONGODB_DBNAME || "monsta";
    const rawUri = process.env.CONNECTIONURL || `mongodb://127.0.0.1:27017/${fallbackDbName}`;

    try {
        const parsedUri = new URL(rawUri);
        if (!parsedUri.pathname || parsedUri.pathname === "/") {
            parsedUri.pathname = `/${fallbackDbName}`;
        }
        return parsedUri.toString();
    } catch (error) {
        return rawUri;
    }
}

App.use("/admin", adminRoute)
App.use("/uploads/category", express.static("uploads/category"))  //static file access
App.use("/uploads/subcategory", express.static("uploads/subcategory"))  //static file access
App.use("/uploads/subsubcategory", express.static("uploads/subsubcategory"))  //static file access
App.use("/uploads/product", express.static("uploads/product"))  //static file access
App.use("/uploads/testimonial", express.static("uploads/testimonial"))  //static file access
App.use("/uploads/whychooseus", express.static("uploads/whychooseus"))  //static file access
App.use("/uploads/aboutwhychooseus", express.static("uploads/aboutwhychooseus"))  //static file access
App.use("/uploads/material", express.static("uploads/material"))  //static file access
App.use("/uploads/slider", express.static("uploads/slider"))  //static file access
App.use("/uploads/product", express.static("uploads/product"))  //static file access

//website route
App.use("/web", webRoute)
App.use("/uploads/profile", express.static("uploads/profile"))  //static file access
App.use("/uploads", express.static("uploads"));  //static file access

mongoose.connect(getMongoUri())
    .then((res) => {
        App.listen(process.env.PORT || 8000, async () => {
            console.log(process.env.PORT || 8000, "Server Started")
            await adminCreate()
        })
    })
