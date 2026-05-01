const mongoose = require("mongoose");

let newsletterModel = mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please Fill Email"],
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid Email Format"],
  },
  status: {
    type: Boolean,
    default: true,
  },
  welcome_sent_at: {
    type: Date,
    default: null,
  },
  last_mail_subject: {
    type: String,
    default: "",
  },
  last_mail_sent_at: {
    type: Date,
    default: null,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  deleted_at: {
    type: Date,
    default: null,
  },
});

let newsletterUseadd = mongoose.model("newsletter", newsletterModel);

module.exports = newsletterUseadd;
