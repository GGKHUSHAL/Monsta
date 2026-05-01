const multer  = require('multer')

let fileUpload=(foldername)=>multer.diskStorage(
    {
        destination:function(req,file,cb){
            cb(null,`uploads/${foldername}`)
        },
        filename:function(req,file,cb){
            cb(null,Date.now()+file.originalname)
        }
    }
)

module.exports={fileUpload}