const mongoose = require('mongoose');

let subsubcategorymodel = mongoose.Schema(
    {
        _subsubcategoryName: {
            type: String,
            required: [true, "Please Fill sub-subcategory Name"],
            minLength: [2, "Please Fill Minimum Two Characters"],
            
        },
        _parentCategoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'category',
            required: [true, "Please Select Parent Category"]
        },
        _subcategoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'subcategory',
            required: [true, "Please Select Subcategory"]
        },
        image: String,
        slug: String,
        _subsubcategoryOrder: {
            type: Number,
            required: [true, "Please Fill Display Order"]
        },
        _subsubcategoryStatus: {
            type: Boolean,
            required: [true, "Please Select Status"]
        },
        _subsubcategory_Created_at: {
            type: Date,
            default: new Date()
        },
        _subsubcategory_Updated_at: {
            type: Date,
            default: new Date()
        },
        _subsubcategory_Deleted_at: {
            type: Date,
            default: null
        }
    }
)
let subsubcategoryUseadd = mongoose.model("subsubcategory", subsubcategorymodel)
module.exports = subsubcategoryUseadd