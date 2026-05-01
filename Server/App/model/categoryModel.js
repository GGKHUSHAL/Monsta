const mongoose = require('mongoose');

let categorymodel = mongoose.Schema(
    {
        _categoryName: {
            type: String,
            required: [true, "Please Fill category Name"],
            minLength: [2, "Please Fill Minimum Two Chra...."],
        },
        image: String,
        slug: String,
        _categoryOrder: {
            type: Number,
            required: [true, "Please Fill Display Order"]
        },
        _categoryStatus: {
            type: Boolean,
            required: [true, "Please Select Status"]
        },
        _category_Creted_at: {
            type: Date,
            default: new Date()
        },
        _category_Updated_at: {
            type: Date,
            default: new Date()
        },
        _category_Deleted_at: {
            type: Date,
            default: null
        }



    }
)
let categoryUseadd = mongoose.model("category", categorymodel)
module.exports = categoryUseadd
