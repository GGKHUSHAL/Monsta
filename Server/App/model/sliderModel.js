const mongoose = require("mongoose");

let sliderModel = mongoose.Schema(
  {
    _sliderTitle: {
      type: String,
      required: [true, "Please Fill Title"],
      minLength: [2, "Please Fill Minimum Two Characters"]
    },

    _sliderSubTitle: {
      type: String,
      required: [true, "Please Fill Sub Title"],
      minLength: [5, "Please Fill Minimum Five Characters"]
    },

    _sliderButtonText: {
      type: String,
      required: [true, "Please Fill Button Text"]
    },

    _sliderButtonLink: {
      type: String,
      required: [true, "Please Fill Button Link"]
    },

    _sliderOrder: {
      type: Number,
      required: [true, "Please Fill Display Order"]
    },

    image: String,

    _sliderStatus: {
      type: Boolean,
      required: [true, "Please Select Status"],
      default: true
    },

    _slider_Creted_at: {
      type: Date,
      default: new Date()
    },

    _slider_Updated_at: {
      type: Date,
      default: new Date()
    },

    _slider_Deleted_at: {
      type: Date,
      default: null
    }
  }
);

let sliderUseadd = mongoose.model(
  "slider",
  sliderModel
);

module.exports = sliderUseadd;