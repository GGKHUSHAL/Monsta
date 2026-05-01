const { type } = require('express/lib/response');
const mongoose = require('mongoose');

let userModel = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please Fill Name"],
            minLength: [2, "Please Fill Minimum Two Characters"],
            match: [/^[a-zA-Z\s]{2,50}$/, "Invalid Name Used"]
        },
        phone_number: {
            type: String,
            required: [true, "Please Fill Phone Number"],

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
        address: {
            type: String,
        },
        billingAddress: {
            name: String,
            email: String,
            mobile: String,
            address: String,
            country: String,
            state: String,
            city: String,
            postcode: String,
        },
        shippingAddress: {
            name: String,
            email: String,
            mobile: String,
            address: String,
            country: String,
            state: String,
            city: String,
            postcode: String,
        },
        gender: {
            type: String,
            enum: ["Male", "Female", "Other"],
            default: "Male"
        },
        profileImage: String,
        status: {
            type: Boolean,
            default: true
        },
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
let userUseadd = mongoose.model("user", userModel)
module.exports = userUseadd
