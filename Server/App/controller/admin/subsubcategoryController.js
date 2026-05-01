let express = require("express")
const { ObjectId } = require("mongodb");
const subsubcategoryUseadd = require("../../model/subsubcategoryModel");
const subcategoryUseadd = require("../../model/subcategoryModel");
const categoryUseadd = require("../../model/categoryModel");

let subsubcategoryCreate = async (req, res) => {
    try {
        let _parentCategoryId = req.body._parentCategoryId || req.body.parentCategoryId || req.body.categoryId;
        let _subcategoryId = req.body._parentSubCategoryId;
        let { _subsubcategoryName, _subsubcategoryOrder } = req.body;

        if (!_parentCategoryId) {
            return res.send({
                _status: false,
                _message: "Parent Category is required"
            });
        }

        if (!_subcategoryId) {
            return res.send({
                _status: false,
                _message: "Subcategory is required"
            });
        }

        // Check if parent category exists and is not deleted
        let categoryExists = await categoryUseadd.findOne({
            _id: new ObjectId(_parentCategoryId),
            _category_Deleted_at: null
        });
        if (!categoryExists) {
            return res.send({
                _status: false,
                _message: "Selected Parent Category does not exist"
            });
        }

        // Check if subcategory exists and belongs to selected parent category
        let subcategoryExists = await subcategoryUseadd.findOne({
            _id: new ObjectId(_subcategoryId),
            _parentCategoryId: new ObjectId(_parentCategoryId),
            _subcategory_Deleted_at: null
        });
        if (!subcategoryExists) {
            return res.send({
                _status: false,
                _message: "Selected Subcategory does not exist"
            });
        }

        // Check if sub-subcategory name already exists within the same subcategory
        let checkName = await subsubcategoryUseadd.findOne({
            _subsubcategoryName: _subsubcategoryName,
            _subcategoryId: new ObjectId(_subcategoryId),
            _subsubcategory_Deleted_at: null
        });
        if (checkName) {
            return res.send({
                _status: false,
                _message: "Sub-subcategory Name Already Used in this Subcategory"
            });
        }

        // Check if sub-subcategory order already exists within the same subcategory
        let checkOrder = await subsubcategoryUseadd.findOne({
            _subsubcategoryOrder: _subsubcategoryOrder,
            _subcategoryId: new ObjectId(_subcategoryId),
            _subsubcategory_Deleted_at: null
        });
        if (checkOrder) {
            return res.send({
                _status: false,
                _message: "Sub-subcategory Display Order Already Used in this Subcategory"
            });
        }

        let insertObj = {
            _subsubcategoryName,
            _parentCategoryId,
            _subcategoryId,
            _subsubcategoryOrder,
            ...req.body
        }

        if (req.file) {
            if (req.file.filename) {
                insertObj["image"] = req.file.filename
            }
        }

        let insertRes = await subsubcategoryUseadd.create(insertObj);

        let obj = {
            _status: true,
            _message: "Sub-subcategory Created",
            insertRes
        }
        res.send(obj)

    } catch (error) {
        let err = {}
        for (let key in error.errors) {
            err[key] = error.errors[key].message
        }
        return res.send({
            _status: false,
            err
        });
    }
}

let subsubcategoryView = async (req, res) => {
    try {
        let data = await subsubcategoryUseadd.find({ _subsubcategory_Deleted_at: null })
            .populate('_parentCategoryId', '_categoryName')
            .populate('_subcategoryId', '_subcategoryName');

        res.send({
            _status: true,
            _message: "Sub-subcategory Viewed",
            path: process.env.SUBSUBCATEGORYPATH,
            data
        });
    } catch (error) {
        return res.send({
            _status: false,
            _message: "Error occurred while fetching sub-subcategories"
        });
    }
}

let getParentCategory = async (req, res) => {

    try {
        let data = await categoryUseadd.find({ _category_Deleted_at: null, _categoryStatus: true }).select("_categoryName");
        res.send({
            _status: true,
            _message: "Parent Categories Fetched",
            data
        });
    } catch (error) {
        return res.send({
            _status: false,
            _message: "Error occurred while fetching parent categories"
        });
    }
}

let getParentSubCategory = async (req, res) => {
    let { parentCategoryId } = req.params;
    try {
        let data = await subcategoryUseadd.find({
            _parentCategoryId: new ObjectId(parentCategoryId),
            _subcategory_Deleted_at: null,
            _subcategoryStatus: true
        })
            .select("_subcategoryName")
            .populate('_parentCategoryId', '_categoryName');

        res.send({
            _status: true,
            _message: "Parent Subcategories Fetched",
            data
        });
    } catch (error) {
        return res.send({
            _status: false,
            _message: "Error occurred while fetching parent subcategories"
        });
    }
}

let subsubcategoryDelete = async (req, res) => {
    try {
        let { ids } = req.body;

        let delRes = await subsubcategoryUseadd.updateMany(
            { _id: ids },
            { $set: { _subsubcategory_Deleted_at: Date.now() } }
        );

        return res.send({
            _status: true,
            _message: "Sub-subcategory Deleted",
            delRes
        });
    } catch (error) {
        let err = {}
        if (error.errors) {
            for (let key in error.errors) {
                err[key] = error.errors[key].message
            }
        } else {
            err.message = error.message || "Something went wrong"
        }
        return res.send({
            _status: false,
            err
        });
    }
}

let subsubcategoryChangeStatus = async (req, res) => {
    try {
        let { ids } = req.body;

        await subsubcategoryUseadd.updateMany(
            { _id: ids },
            [
                {
                    $set: { _subsubcategoryStatus: { $not: "$_subsubcategoryStatus" } }
                }
            ],
            {
                updatePipeline: true
            }
        );

        return res.send({
            _status: true,
            _message: "Sub-subcategory Status Changed"
        });
    } catch (error) {
        let err = {}
        if (error.errors) {
            for (let key in error.errors) {
                err[key] = error.errors[key].message
            }
        } else {
            err.message = error.message || "Something went wrong"
        }
        return res.send({
            _status: false,
            err
        });
    }
}

let subsubcategoryUpdate = async (req, res) => {
    try {
        let { id } = req.params;
        let _parentCategoryId = req.body._parentCategoryId || req.body.parentCategoryId || req.body.categoryId;
        let _subcategoryId =
            req.body._subcategoryId ||
            req.body.subcategoryId ||
            req.body._parentSubCategoryId;
        let { _subsubcategoryName, _subsubcategoryOrder } = req.body;

        if (!_parentCategoryId) {
            return res.send({
                _status: false,
                _message: "Parent Category is required"
            });
        }

        if (!_subcategoryId) {
            return res.send({
                _status: false,
                _message: "Subcategory is required"
            });
        }

        // Check if parent category exists and is not deleted
        let categoryExists = await categoryUseadd.findOne({
            _id: new ObjectId(_parentCategoryId),
            _category_Deleted_at: null
        });
        if (!categoryExists) {
            return res.send({
                _status: false,
                _message: "Selected Parent Category does not exist"
            });
        }

        // Check if subcategory exists and belongs to selected parent category
        let subcategoryExists = await subcategoryUseadd.findOne({
            _id: new ObjectId(_subcategoryId),
            _parentCategoryId: new ObjectId(_parentCategoryId),
            _subcategory_Deleted_at: null
        });
        if (!subcategoryExists) {
            return res.send({
                _status: false,
                _message: "Selected Subcategory does not exist"
            });
        }

        // check sub-subcategory name duplicate within same subcategory
        let checkName = await subsubcategoryUseadd.findOne({
            _subsubcategoryName: _subsubcategoryName,
            _subcategoryId: new ObjectId(_subcategoryId),
            _subsubcategory_Deleted_at: null,
            _id: { $ne: new ObjectId(id) }
        });

        if (checkName) {
            return res.send({
                _status: false,
                _message: "Sub-subcategory Name Already Used in this Subcategory"
            });
        }

        // check order duplicate within same subcategory
        let checkOrder = await subsubcategoryUseadd.findOne({
            _subsubcategoryOrder: _subsubcategoryOrder,
            _subcategoryId: new ObjectId(_subcategoryId),
            _subsubcategory_Deleted_at: null,
            _id: { $ne: new ObjectId(id) }
        });

        if (checkOrder) {
            return res.send({
                _status: false,
                _message: "Sub-subcategory Display Order Already Used in this Subcategory"
            });
        }

        // Find the existing sub-subcategory
        let existingSubsubcategory = await subsubcategoryUseadd.findOne({
            _id: new ObjectId(id),
            _subsubcategory_Deleted_at: null
        });

        if (!existingSubsubcategory) {
            return res.send({
                _status: false,
                _message: "Sub-subcategory not found"
            });
        }

        // Update the fields
        existingSubsubcategory._subsubcategoryName = _subsubcategoryName;
        existingSubsubcategory._parentCategoryId = _parentCategoryId;
        existingSubsubcategory._subcategoryId = _subcategoryId;
        existingSubsubcategory._subsubcategoryOrder = _subsubcategoryOrder;

        if (req.body._subsubcategoryStatus !== undefined) {
            existingSubsubcategory._subsubcategoryStatus = req.body._subsubcategoryStatus;
        }
        if (req.body.slug !== undefined) {
            existingSubsubcategory.slug = req.body.slug;
        }

        if (req.file) {
            if (req.file.filename) {
                existingSubsubcategory.image = req.file.filename;
            }
        }

        existingSubsubcategory._subsubcategory_Updated_at = new Date();

        // Save the updated document
        let updateRes = await existingSubsubcategory.save();

        return res.send({
            _status: true,
            _message: "Sub-subcategory Updated Successfully",
            updateRes
        });
    } catch (error) {
        let err = {};
        if (error.errors) {
            for (let key in error.errors) {
                err[key] = error.errors[key].message;
            }
        } else {
            err.message = error.message || "Something went wrong"
        }
        return res.send({
            _status: false,
            err
        });
    }
}

let subsubcategoryViewOne = async (req, res) => {
    try {
        let { id } = req.params;

        let data = await subsubcategoryUseadd.findOne({
            _id: new ObjectId(id),
            _subsubcategory_Deleted_at: null
        })
            .populate('_parentCategoryId', '_categoryName')
            .populate('_subcategoryId', '_subcategoryName');

        if (!data) {
            return res.send({
                _status: false,
                _message: "Sub-subcategory not found"
            });
        }

        return res.send({
            _status: true,
            _message: "Sub-subcategory Viewed",
            data
        });
    } catch (error) {
        let err = {};
        if (error.errors) {
            for (let key in error.errors) {
                err[key] = error.errors[key].message;
            }
        } else {
            err.message = error.message || "Something went wrong"
        }
        return res.send({
            _status: false,
            err
        });
    }
}

module.exports = {
    subsubcategoryCreate,
    subsubcategoryView,
    getParentCategory,
    getParentSubCategory,
    subsubcategoryDelete,
    subsubcategoryChangeStatus,
    subsubcategoryUpdate,
    subsubcategoryViewOne
}