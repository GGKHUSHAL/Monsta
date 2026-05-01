const mongoose = require("mongoose");

let aboutWhyChooseModel = mongoose.Schema(
  {
    _aboutWhyChooseTitle: {
      type: String,
      required: [true, "Please Fill Title"],
      minLength: [2, "Please Fill Minimum Two Characters"]
    },

    _aboutWhyChooseDescription: {
      type: String,
      required: [true, "Please Fill Description"],
      minLength: [5, "Please Fill Minimum Five Characters"]
    },

    _aboutWhyChooseOrder: {
      type: Number,
      required: [true, "Please Fill Display Order"]
    },

    image: String,

    _aboutWhyChooseStatus: {
      type: Boolean,
      required: [true, "Please Select Status"],
      default: true
    },

    _aboutWhyChoose_Creted_at: {
      type: Date,
      default: new Date()
    },

    _aboutWhyChoose_Updated_at: {
      type: Date,
      default: new Date()
    },

    _aboutWhyChoose_Deleted_at: {
      type: Date,
      default: null
    }
  }
);

let aboutWhyChooseUseadd = mongoose.model(
  "aboutwhychoose",
  aboutWhyChooseModel
);

module.exports = aboutWhyChooseUseadd;
