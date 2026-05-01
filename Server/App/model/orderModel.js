const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
    {
        name: String,
        email: String,
        mobile: String,
        address: String,
        country: String,
        state: String,
        city: String,
        postcode: String
    },
    { _id: false }
);

const orderItemSchema = new mongoose.Schema(
    {
        productId: String,
        slug: String,
        name: String,
        image: String,
        price: Number,
        quantity: Number,
        selectedColor: String,
        selectedMaterial: String,
        total: Number
    },
    { _id: false }
);

const orderSchema = new mongoose.Schema(
    {
        orderNumber: {
            type: String,
            unique: true,
            default: () => `MON-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true
        },
        items: [orderItemSchema],
        billingAddress: addressSchema,
        shippingAddress: addressSchema,
        orderNotes: String,
        paymentMethod: {
            type: String,
            enum: ["cod", "online"],
            default: "cod"
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "pending"
        },
        razorpayOrderId: String,
        razorpayPaymentId: String,
        razorpaySignature: String,
        orderStatus: {
            type: String,
            enum: ["pending", "processing", "shipped", "completed", "cancelled"],
            default: "pending"
        },
        subtotal: {
            type: Number,
            default: 0
        },
        discount: {
            type: Number,
            default: 0
        },
        total: {
            type: Number,
            default: 0
        },
        deleted_at: {
            type: Date,
            default: null
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("orders", orderSchema);
