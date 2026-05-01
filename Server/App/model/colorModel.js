const mongoose = require('mongoose');

let colormodel = mongoose.Schema(
    {
        _colorName: {
            type: String,
            required: [true, "Please Fill Color Name"],
            minLength:[2,"Please Fill Minimum Two Chra...."],
           
        },
        _colorType: {
            type: String,
            required: [true, "Please Select Color Type"]
        },
        _colorCode: {
            type: String,
            required: [true, "Please Fill Color-Code"]
        },
        _colorOrder: {
            type: Number,
            required: [true, "Please Fill Display Order"]
        },
        _colorStatus: {
            type: Boolean,
            required: [true, "Please Select Status"]
        },
        _color_Creted_at: {
            type: Date,
            default: new Date()
        },
        _color_Updated_at: {
            type: Date,
            default: new Date()
        },
        _color_Deleted_at: {
            type: Date,
            default: null
        }



    }
)
let colorUseadd = mongoose.model("color", colormodel)
module.exports = colorUseadd
