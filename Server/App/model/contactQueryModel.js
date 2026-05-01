const mongoose = require("mongoose");

let contactQueryModel = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Fill Name"],
      minLength: [2, "Please Fill Minimum Two Characters"]
    },
    email: {
      type: String,
      required: [true, "Please Fill Email"],
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid Email Format"]
    },
    mobile: {
      type: String,
      required: [true, "Please Fill Mobile Number"],
      match: [/^[0-9]{10}$/, "Mobile number must be exactly 10 digits"]
    },
    subject: {
      type: String,
      required: [true, "Please Fill Subject"],
      minLength: [2, "Please Fill Minimum Two Characters"]
    },
    message: {
      type: String,
      required: [true, "Please Fill Message"],
      minLength: [5, "Please Fill Minimum Five Characters"]
    },
    status: {
      type: Boolean,
      default: true
    },
    reply_subject: {
      type: String,
      default: ""
    },
    reply_message: {
      type: String,
      default: ""
    },
    reply_sent_at: {
      type: Date,
      default: null
    },
    acknowledgement_sent_at: {
      type: Date,
      default: null
    },
    created_at: {
      type: Date,
      default: Date.now
    },
    updated_at: {
      type: Date,
      default: Date.now
    },
    deleted_at: {
      type: Date,
      default: null
    }
  }
);

let contactQueryUseadd = mongoose.model("contactquery", contactQueryModel);

module.exports = contactQueryUseadd;
