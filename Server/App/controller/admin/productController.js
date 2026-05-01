let express = require("express");
const { ObjectId } = require("mongodb");

const categoryUseadd = require("../../model/categoryModel");
const subcategoryUseadd = require("../../model/subcategoryModel");
const subsubcategoryUseadd = require("../../model/subsubcategoryModel");
const colorUseadd = require("../../model/colorModel");
const materialUseadd = require("../../model/materialModel");
const productUseadd = require("../../model/productModel");
const { createSlug } = require("../../config/helper");

// ===================================
// ADD PRODUCT
// ===================================
let addProduct = async (req, res) => {
    try {
        let {
            _productName,
            _productOrder,
            _productParentCategory,
            _productSubCategory,
            _productSubSubCategory,
            _productMaterial,
            _productColor,
            _productType,
            _bestSelling,
            _topRated,
            _upsell,
            _productPrice,
            _productSalePrice,
            _productStock,
            _productShortDescription,
            _productDescription,
            _productStatus
        } = req.body;

        let checkOrder = await productUseadd.findOne({
            _productOrder,
            _product_Deleted_at: null
        });

        if (checkOrder) {
            return res.send({
                _status: false,
                _message: "This Order Number Already Used"
            });
        }

        let insertObj = {
            _productName,
            _productOrder,
            _productParentCategory,
            _productSubCategory,
            _productSubSubCategory,
            _productType,

            _bestSelling:
                _bestSelling === "Yes" ||
                _bestSelling === true,

            _topRated:
                _topRated === "Yes" ||
                _topRated === true,

            _upsell:
                _upsell === "Yes" ||
                _upsell === true,

            _productPrice,
            _productSalePrice,
            _productStock,
            _productShortDescription,
            _productDescription,

            _productStatus:
                _productStatus === "Active" ||
                _productStatus === true,

            _product_Creted_at: new Date(),
            _product_Updated_at: new Date()
        };

        if (_productMaterial) {
            insertObj._productMaterial =
                Array.isArray(_productMaterial)
                    ? _productMaterial
                    : [_productMaterial];
        }

        if (_productColor) {
            insertObj._productColor =
                Array.isArray(_productColor)
                    ? _productColor
                    : [_productColor];
        }

        if (
            req.files &&
            req.files.image &&
            req.files.image[0]
        ) {
            insertObj.image =
                req.files.image[0].filename;
        }

        if (
            req.files &&
            req.files.gallery
        ) {
            insertObj.gallery =
                req.files.gallery.map(
                    (item) => item.filename
                );
        }

        let baseSlug = createSlug(_productName);

        let slug = baseSlug;
        let count = 1;

        while (
            await productUseadd.findOne({
                slug: slug
            })
        ) {
            slug = `${baseSlug}-${count}`;
            count++;
        }

        insertObj.slug = slug;

        let data =
            await productUseadd.create(
                insertObj
            );

        return res.send({
            _status: true,
            _message:
                "Product Added Successfully",
            data
        });
    } catch (error) {
        console.log(error);

        return res.send({
            _status: false,
            _message:
                "Error occurred while adding product"
        });
    }
};

// ===================================
// VIEW ALL PRODUCT
// ===================================
let viewAllProduct = async (req, res) => {
    try {
        let data = await productUseadd
            .find({
                _product_Deleted_at: null
            })
            .populate(
                "_productParentCategory",
                "_categoryName"
            )
            .populate(
                "_productSubCategory",
                "_subcategoryName"
            )
            .populate(
                "_productSubSubCategory",
                "_subsubcategoryName"
            )
            .populate(
                "_productMaterial",
                "_materialName"
            )
            .sort({
                _productOrder: 1
            });

        let finalData = data.map(
            (item) => {
                let obj = item.toObject();

                obj.imagePath = item.image
                    ? `${process.env.PRODUCTPATH}${item.image}`
                    : "";

                obj.galleryPath =
                    item.gallery?.map(
                        (img) =>
                            `${process.env.PRODUCTPATH}${img}`
                    ) || [];

                return obj;
            }
        );

        return res.send({
            _status: true,
            _message:
                "All Products Fetched Successfully",
            data: finalData
        });
    } catch (error) {
        return res.send({
            _status: false,
            _message:
                "Error occurred while fetching products"
        });
    }
};

// ===================================
// VIEW PRODUCT BY SLUG
// ===================================
let viewSlugProduct = async (req, res) => {
    try {
        let { slug } = req.params;

        let data = await productUseadd
            .findOne({
                slug: slug,
                _product_Deleted_at: null
            })
            .populate(
                "_productParentCategory",
                "_categoryName"
            )
            .populate(
                "_productSubCategory",
                "_subcategoryName"
            )
            .populate(
                "_productSubSubCategory",
                "_subsubcategoryName"
            )
            .populate(
                "_productMaterial",
                "_materialName"
            );

        if (!data) {
            return res.send({
                _status: false,
                _message:
                    "Product Not Found"
            });
        }

        let obj = data.toObject();

        obj.imagePath = data.image
            ? `${process.env.PRODUCTPATH}${data.image}`
            : "";

        obj.galleryPath =
            data.gallery?.map(
                (img) =>
                    `${process.env.PRODUCTPATH}${img}`
            ) || [];

        return res.send({
            _status: true,
            _message:
                "Product Fetched Successfully",
            data: obj
        });
    } catch (error) {
        return res.send({
            _status: false,
            _message:
                "Error occurred while fetching product"
        });
    }
};

// ===================================
// VIEW ONE PRODUCT
// ===================================
let viewOneProduct = async (req, res) => {
    try {
        let { id } = req.params;

        let data =
            await productUseadd
                .findOne({
                    _id: id,
                    _product_Deleted_at: null
                })
                .populate(
                    "_productParentCategory",
                    "_categoryName"
                )
                .populate(
                    "_productSubCategory",
                    "_subcategoryName"
                )
                .populate(
                    "_productSubSubCategory",
                    "_subsubcategoryName"
                )
                .populate(
                    "_productMaterial",
                    "_materialName"
                );

        if (!data) {
            return res.send({
                _status: false,
                _message:
                    "Product Not Found"
            });
        }

        let obj = data.toObject();

        obj.imagePath = data.image
            ? `${process.env.PRODUCTPATH}${data.image}`
            : "";

        obj.galleryPath =
            data.gallery?.map(
                (img) =>
                    `${process.env.PRODUCTPATH}${img}`
            ) || [];

        return res.send({
            _status: true,
            _message:
                "Product Fetched Successfully",
            data: obj
        });
    } catch (error) {
        return res.send({
            _status: false,
            _message:
                "Error occurred while fetching product"
        });
    }
};

// ===================================
// DELETE PRODUCT
// ===================================
let deleteProduct = async (req, res) => {
    try {
        let { ids } = req.body;

        await productUseadd.updateMany(
            {
                _id: { $in: ids }
            },
            {
                $set: {
                    _product_Deleted_at:
                        new Date()
                }
            }
        );

        return res.send({
            _status: true,
            _message:
                "Product Deleted Successfully"
        });
    } catch (error) {
        return res.send({
            _status: false,
            _message:
                "Error occurred while deleting product"
        });
    }
};

// ===================================
// CHANGE STATUS
// ===================================
let changeProductStatus = async (req, res) => {
    try {
        let { ids } = req.body;

        if (!ids || ids.length === 0) {
            return res.send({
                _status: false,
                _message: "Please Select Product"
            });
        }

        for (let id of ids) {
            let product =
                await productUseadd.findById(id);

            if (product) {
                await productUseadd.updateOne(
                    { _id: id },
                    {
                        $set: {
                            _productStatus:
                                !product._productStatus
                        }
                    }
                );
            }
        }

        return res.send({
            _status: true,
            _message:
                "Status Changed Successfully"
        });
    } catch (error) {
        console.log(error);

        return res.send({
            _status: false,
            _message:
                "Error occurred while changing status"
        });
    }
};

// ===================================
// UPDATE PRODUCT
// ===================================
let updateProduct = async (req, res) => {
    try {
        let { id } = req.params;

        let {
            _productName,
            _productOrder,
            _productParentCategory,
            _productSubCategory,
            _productSubSubCategory,
            _productMaterial,
            _productColor,
            _productType,
            _bestSelling,
            _topRated,
            _upsell,
            _productPrice,
            _productSalePrice,
            _productStock,
            _productShortDescription,
            _productDescription,
            _productStatus
        } = req.body;

        let checkOrder = await productUseadd.findOne({
            _productOrder,
            _product_Deleted_at: null,
            _id: { $ne: id }
        });

        if (checkOrder) {
            return res.send({
                _status: false,
                _message:
                    "This Order Number Already Used"
            });
        }

        let updateObj = {
            _productName,
            _productOrder,
            _productParentCategory,
            _productSubCategory,
            _productSubSubCategory,
            _productType,

            _bestSelling:
                _bestSelling === "Yes" ||
                _bestSelling === true,

            _topRated:
                _topRated === "Yes" ||
                _topRated === true,

            _upsell:
                _upsell === "Yes" ||
                _upsell === true,

            _productPrice,
            _productSalePrice,
            _productStock,
            _productShortDescription,
            _productDescription,

            _productStatus:
                _productStatus === "Active" ||
                _productStatus === true,

            _product_Updated_at:
                new Date()
        };

        if (_productMaterial) {
            updateObj._productMaterial =
                Array.isArray(_productMaterial)
                    ? _productMaterial
                    : [_productMaterial];
        }

        if (_productColor) {
            updateObj._productColor =
                Array.isArray(_productColor)
                    ? _productColor
                    : [_productColor];
        }

        if (
            req.files &&
            req.files.image &&
            req.files.image[0]
        ) {
            updateObj.image =
                req.files.image[0].filename;
        }

        if (
            req.files &&
            req.files.gallery
        ) {
            updateObj.gallery =
                req.files.gallery.map(
                    (item) =>
                        item.filename
                );
        }

        let baseSlug = createSlug(_productName);

        let slug = baseSlug;
        let count = 1;

        while (
            await productUseadd.findOne({
                slug: slug
            })
        ) {
            slug = `${baseSlug}-${count}`;
            count++;
        }

        updateObj .slug = slug;

        await productUseadd.updateOne(
            { _id: id },
            {
                $set: updateObj
            }
        );

        return res.send({
            _status: true,
            _message:
                "Product Updated Successfully"
        });
    } catch (error) {
        console.log(error);

        return res.send({
            _status: false,
            _message:
                "Error occurred while updating product"
        });
    }
};

// ===================================
// DROPDOWN APIs
// ===================================
let getParentCategory = async (req, res) => {
    try {
        let data =
            await categoryUseadd.find({
                _category_Deleted_at: null,
                _categoryStatus: true
            }).select("_categoryName");

        res.send({
            _status: true,
            _message:
                "Parent Categories Fetched",
            data
        });
    } catch (error) {
        res.send({
            _status: false,
            _message:
                "Error occurred while fetching parent categories"
        });
    }
};

let getParentSubCategory =
    async (req, res) => {
        try {
            let {
                parentCategoryId
            } = req.params;

            let data =
                await subcategoryUseadd
                    .find({
                        _parentCategoryId:
                            new ObjectId(
                                parentCategoryId
                            ),
                        _subcategory_Deleted_at:
                            null,
                        _subcategoryStatus:
                            true
                    })
                    .select(
                        "_subcategoryName"
                    );

            res.send({
                _status: true,
                _message:
                    "Parent Subcategories Fetched",
                data
            });
        } catch (error) {
            res.send({
                _status: false,
                _message:
                    "Error occurred while fetching subcategories"
            });
        }
    };

let getParentSubSubCategory =
    async (req, res) => {
        try {
            let {
                parentSubCategoryId
            } = req.params;

            let data =
                await subsubcategoryUseadd
                    .find({
                        _subcategoryId:
                            new ObjectId(
                                parentSubCategoryId
                            ),
                        _subsubcategory_Deleted_at:
                            null,
                        _subsubcategoryStatus:
                            true
                    })
                    .select(
                        "_subsubcategoryName"
                    );

            res.send({
                _status: true,
                _message:
                    "Parent Sub Sub Categories Fetched",
                data
            });
        } catch (error) {
            res.send({
                _status: false,
                _message:
                    "Error occurred while fetching sub sub categories"
            });
        }
    };

let getColor = async (req, res) => {
    try {
        let data =
            await colorUseadd.find({
                _color_Deleted_at: null,
                _colorStatus: true
            }).select("_colorName");

        res.send({
            _status: true,
            _message:
                "Colors Fetched",
            data
        });
    } catch (error) {
        res.send({
            _status: false,
            _message:
                "Error occurred while fetching colors"
        });
    }
};

let getMaterial = async (req, res) => {
    try {
        let data =
            await materialUseadd.find({
                _material_Deleted_at: null,
                _materialStatus: true
            }).select("_materialName");

        res.send({
            _status: true,
            _message:
                "Materials Fetched",
            data
        });
    } catch (error) {
        res.send({
            _status: false,
            _message:
                "Error occurred while fetching materials"
        });
    }
};

module.exports = {
    addProduct,
    viewAllProduct,
    viewOneProduct,
    deleteProduct,
    changeProductStatus,
    updateProduct,
    getParentCategory,
    getParentSubCategory,
    getParentSubSubCategory,
    getColor,
    getMaterial,
    viewSlugProduct
};