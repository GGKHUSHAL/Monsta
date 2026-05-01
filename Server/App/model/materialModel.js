const mongoose = require("mongoose");

let materialModel = mongoose.Schema(
  {
    _materialName: {
      type: String,
      required: [true, "Please Fill Material Name"],
      minLength: [2, "Please Fill Minimum Two Characters"]
    },

    _materialType: {
      type: String,
      required: [true, "Please Select Material Type"]
    },

    _materialDescription: {
      type: String,
      required: [true, "Please Fill Description"],
      minLength: [5, "Please Fill Minimum Five Characters"]
    },

    _materialPriceImpact: {
      type: Number,
      required: [true, "Please Fill Price Impact"]
    },

    _materialSupportColors: {
      type: Boolean,
      required: [true, "Please Select Support Colors"],
      default: true
    },

    _materialOrder: {
      type: Number,
      required: [true, "Please Fill Display Order"]
    },

    image: String,

    _materialStatus: {
      type: Boolean,
      required: [true, "Please Select Status"],
      default: true
    },

    _material_Creted_at: {
      type: Date,
      default: new Date()
    },

    _material_Updated_at: {
      type: Date,
      default: new Date()
    },

    _material_Deleted_at: {
      type: Date,
      default: null
    }
  }
);

let materialUseadd = mongoose.model(
  "material",
  materialModel
);

module.exports = materialUseadd;