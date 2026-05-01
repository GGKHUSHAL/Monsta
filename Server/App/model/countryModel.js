const mongoose = require("mongoose");

const countrySchema = new mongoose.Schema({

    _countryName: {
        type: String,
        required: true,
        trim: true
    },

    _countryCode: {
        type: String,
        required: true,
        trim: true
    },

    _phoneCode: {
        type: String,
        required: true
    },

    _currency: {
        type: String,
        required: true
    },

    _flag: {
        type: String
    },

    _order: {
        type: Number,
        default: 0
    },

    _status: {
        type: Boolean,
        default: true
    },

    _countryDeletedAt: {
        type: Date,
        default: null
    }

}, { timestamps: true })

let countryUseadd = mongoose.model("countries",countrySchema)

module.exports = countryUseadd