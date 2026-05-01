const mongoose = require("mongoose");

let testimonialModel = mongoose.Schema(
  {
    _testimonialName: {
      type: String,
      required: [true, "Please Fill Name"],
      minLength: [2, "Please Fill Minimum Two Characters"]
    },

    _testimonialMessage: {
      type: String,
      required: [true, "Please Fill Message"],
      minLength: [5, "Please Fill Minimum Five Characters"]
    },

    _testimonialDesignation: {
      type: String,
      required: [true, "Please Fill Job Title"],
      minLength: [2, "Please Fill Minimum Two Characters"]
    },

    _testimonialRating: {
      type: Number,
      required: [true, "Please Fill Rating Number"],
      min: [1, "Minimum Rating is 1"],
      max: [5, "Maximum Rating is 5"]
    },

    _testimonialOrder: {
      type: Number,
      required: [true, "Please Fill Order Number"]
    },

    image: String,

    _testimonialStatus: {
      type: Boolean,
      required: [true, "Please Select Status"],
      default: true
    },

    _testimonial_Creted_at: {
      type: Date,
      default: new Date()
    },

    _testimonial_Updated_at: {
      type: Date,
      default: new Date()
    },

    _testimonial_Deleted_at: {
      type: Date,
      default: null
    }
  }
);

let testimonialUseadd = mongoose.model(
  "testimonial",
  testimonialModel
);

module.exports = testimonialUseadd;
