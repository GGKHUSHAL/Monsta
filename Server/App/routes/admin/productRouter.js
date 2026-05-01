let express = require("express");
const multer = require("multer");

const {
  getParentCategory,
  getParentSubCategory,
  getParentSubSubCategory,
  getColor,
  getMaterial,
  addProduct,
  viewAllProduct,
  deleteProduct,
  updateProduct,
  viewOneProduct,
  changeProductStatus,
  viewSlugProduct
} = require("../../controller/admin/productController");

const { fileUpload } = require("../../middleware/fileUpload");

let productRouter = express.Router();

let storage = fileUpload("product");
let upload = multer({ storage: storage });

// ADD PRODUCT
productRouter.post(
  "/addproduct",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "gallery", maxCount: 5 }
  ]),
  addProduct
);

// VIEW ALL PRODUCT
productRouter.get(
  "/view",
  viewAllProduct
);

// VIEW ONE PRODUCT
productRouter.get(
  "/view/:id",
  viewOneProduct
);

// UPDATE PRODUCT
productRouter.put(
  "/update/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "gallery", maxCount: 5 }
  ]),
  updateProduct
);

// DELETE PRODUCT
productRouter.post(
  "/delete",
  deleteProduct
);

// CHANGE STATUS
productRouter.post(
  "/changestatus",
  changeProductStatus
);

// Get deatils with Slug
productRouter.get(
  "/productdetails/:slug",
  viewSlugProduct
);

// DROPDOWN APIs
productRouter.get(
  "/parentcategory",
  getParentCategory
);

productRouter.get(
  "/parentsubcategory/:parentCategoryId",
  getParentSubCategory
);

productRouter.get(
  "/parentsubsubcategory/:parentSubCategoryId",
  getParentSubSubCategory
);

productRouter.get(
  "/color",
  getColor
);

productRouter.get(
  "/material",
  getMaterial
);

module.exports = { productRouter };