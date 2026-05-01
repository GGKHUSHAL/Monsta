const { type } = require('express/lib/response');
const mongoose = require('mongoose');

let adminModel = mongoose.Schema(
    {
        name: {
            type: String,
            minLength: [2, "Please Fill Minimum Two Characters"],
            match: [/^[a-zA-Z\s]{2,50}$/, "Invalid Name Used"]
        },
        phone_number: {
            type: String,

            match: [/^[0-9]{10}$/, "Phone number must be exactly 10 digits"],

            validate: {
                validator: async function (value) {
                    const phone = await this.constructor.findOne({
                        phone_number: value,
                        deleted_at: null
                    });
                    return !phone;
                },
                message: "phone-number Already Used"
            }
        },
        email: {
            type: String,
            required: [true, "Please Fill Email"],
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid Email Format"],
            validate: {
                validator: async function (value) {
                    const email = await this.constructor.findOne({ email: value, deleted_at: null });
                    return !email
                },
                message: props => "Email Already Used"
            }
        },
        password: {
            type: String,
            required: [true, "Please Fill Password"],
            minLength: [6, "Please Fill Minimum Six Characters"]
        },
        role: {
            type: String,
            enum: ["super_admin", "admin"],
            default: "admin"
        },
        company_address: {
            type: String,
        },
        company_name: {
            type: String,
        },
        company_logo: String,
        company_map_location: String,
        company_email: {
            type: String,
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid Email Format"],
        },
        company_phone_number: {
            type: String,
            match: [/^[0-9]{10}$/, "Phone number must be exactly 10 digits"],
        },
        company_facebook_link: String,
        company_instagram_link: String,
        company_twitter_link: String,
        company_youtube_link: String,
        company_linkedin_link: String,
        company_telegram_link: String,
        gender: {
            type: String,
            enum: ["Male", "Female", "Other"],
            default: "Male"
        },
        profileImage: String,
        created_at: {
            type: Date,
            default: new Date()
        },
        updated_at: {
            type: Date,
            default: new Date()
        },
        deleted_at: {
            type: Date,
            default: null
        }
    }
)
let adminUseadd = mongoose.model("admin", adminModel)
module.exports = adminUseadd
