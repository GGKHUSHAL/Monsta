var slugify = require('slugify')
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const adminUseadd = require('../model/adminModel');
let createSlug = (title) => {
  return slugify(title, {
    replacement: '-',  // replace spaces with replacement character, defaults to `-`
    remove: undefined, // remove characters that match regex, defaults to `undefined`
    lower: true,      // convert to lower case, defaults to `false`
    strict: false,     // strip special characters except replacement, defaults to `false`
    locale: 'vi',      // language code of the locale to use
    trim: true         // trim leading and trailing replacement chars, defaults to `true`
  })
}

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: "khushalchoudhary116@gmail.com",
    pass: "ztjs edps wueb ajbv",
  },
  tls: {
    rejectUnauthorized: false, // ✅ FIX
  },
});

let adminCreate = async (req, res) => {
  let adminData = await adminUseadd.find();
  if (adminData.length === 0) {
    let hash = await bcrypt.hash("Giradhar456", 10);
    adminUseadd.insertOne({
      name: "Khushal Choudhary",
      phone_number: "1234567890",
      email: "khushalchoudhary116@gmail.com",
      role : "super_admin",
      password: hash
    });
  }

}

module.exports = { createSlug, transporter, adminCreate };