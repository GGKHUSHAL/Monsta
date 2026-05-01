let express = require("express")
const { createuser, loginuser, changePassword, forgotPassword, resetPassword, getUserData, updateProfile, updateAddresses } = require("../../controller/web/authController")
const { checkToken } = require("../../middleware/checkToken")
const multer = require("multer")

let storage = multer.diskStorage(
    {
        destination:function(req,file,cb){
            cb(null,"uploads/profile")
        },
        filename:function(req,file,cb){
            cb(null,Date.now()+file.originalname)
        }
    }
)
let upload=multer({storage:storage})

let authRoute = express.Router()  //API create


authRoute.post("/register",createuser)

authRoute.post("/login",loginuser)

authRoute.post("/change-password", checkToken, changePassword)

authRoute.post("/reset-password", resetPassword)

authRoute.post("/forgot-password",forgotPassword)

authRoute.post("/get-data", checkToken, getUserData)

authRoute.post("/update-profile", checkToken, upload.single('profileImage'), updateProfile)

authRoute.post("/update-addresses", checkToken, updateAddresses)

module.exports = {authRoute}
