const mongoose = require("mongoose");

let productModel = mongoose.Schema(
  {
    _productName: {
      type: String,
      required: [true, "Please Fill Product Name"],
      minLength: [2, "Please Fill Minimum Two Characters"]
    },

    _productOrder: {
      type: Number,
      required: [true, "Please Fill Order Number"]
    },

    _productParentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      required: [true, "Please Select Parent Category"]
    },

    _productSubCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subcategory",
      required: [true, "Please Select Sub Category"]
    },

    _productSubSubCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subsubcategory",
      required: [true, "Please Select Sub Sub Category"]
    },

    _productMaterial: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "material",
        required: true
      }
    ],

    _productColor: [
      {
        type: String,
        required: true
      }
    ],

    _productType: {
      type: String,
      enum: [
        "featured",
        "new arrivals",
        "onsale"
      ],
      required: [
        true,
        "Please Select Product Type"
      ]
    },

    _bestSelling: {
      type: Boolean,
      default: false
    },

    _topRated: {
      type: Boolean,
      default: false
    },

    _upsell: {
      type: Boolean,
      default: false
    },

    _productPrice: {
      type: Number,
      required: [true, "Please Fill Price"]
    },

    _productSalePrice: {
      type: Number,
      default: 0
    },

    _productStock: {
      type: Number,
      required: [true, "Please Fill Stock"]
    },

    _productShortDescription: {
      type: String,
      required: [true, "Please Fill Short Description"],
      minLength: [5, "Please Fill Minimum Five Characters"]
    },

    _productDescription: {
      type: String,
      required: [true, "Please Fill Description"],
      minLength: [10, "Please Fill Minimum Ten Characters"]
    },

    image: String,

    gallery: [String],

    slug: String,

    _productStatus: {
      type: Boolean,
      required: [true, "Please Select Status"],
      default: true
    },

    _product_Creted_at: {
      type: Date,
      default: new Date()
    },

    _product_Updated_at: {
      type: Date,
      default: new Date()
    },

    _product_Deleted_at: {
      type: Date,
      default: null
    }
  }
);

let productUseadd = mongoose.model(
  "product",
  productModel
);

module.exports = productUseadd;