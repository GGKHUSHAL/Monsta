const mongoose = require('mongoose');

let subcategorymodel = mongoose.Schema(
    {
        _subcategoryName: {
            type: String,
            required: [true, "Please Fill subcategory Name"],
            minLength: [2, "Please Fill Minimum Two Characters"],
            
        },
        _parentCategoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'category',
            required: [true, "Please Select Parent Category"]
        },
        image: String,
        slug: String,
        _subcategoryOrder: {
            type: Number,
            required: [true, "Please Fill Display Order"]
        },
        _subcategoryStatus: {
            type: Boolean,
            required: [true, "Please Select Status"]
        },
        _subcategory_Created_at: {
            type: Date,
            default: new Date()
        },
        _subcategory_Updated_at: {
            type: Date,
            default: new Date()
        },
        _subcategory_Deleted_at: {
            type: Date,
            default: null
        }
    }
)
let subcategoryUseadd = mongoose.model("subcategory", subcategorymodel)
module.exports = subcategoryUseadd