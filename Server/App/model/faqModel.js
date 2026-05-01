const mongoose = require('mongoose');

let faqmodel = mongoose.Schema(
    {
        _faqQuestion: {
            type: String,
            required: [true, "Please Fill faq Question"],
            minLength:[2,"Please Fill Minimum Two Chra...."],
        },
        _faqAnswere: {
            type: String,
            required: [true, "Please Select faq Type"],
            minLength:[2,"Please Fill Minimum Two Chra...."]
        },
        _faqOrder: {
            type: Number,
            required: [true, "Please Fill Display Order"]
        },
        _faqStatus: {
            type: Boolean,
            required: [true, "Please Select Status"]
        },
        _faq_Creted_at: {
            type: Date,
            default: new Date()
        },
        _faq_Updated_at: {
            type: Date,
            default: new Date()
        },
        _faq_Deleted_at: {
            type: Date,
            default: null
        }
    }
)
let faqUseadd = mongoose.model("faq", faqmodel)
module.exports = faqUseadd
