let express = require("express")
const { ObjectId } = require("mongodb");
const subcategoryUseadd = require("../../model/subcategoryModel");
const categoryUseadd = require("../../model/categoryModel");

let subcategoryCreate = async (req, res) => {
    try {
        let { _subcategoryName, _parentCategoryId, _subcategoryOrder } = req.body;

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

        // Check if subcategory name already exists within the same parent category
        let checkName = await subcategoryUseadd.findOne({
            _subcategoryName: _subcategoryName,
            _parentCategoryId: new ObjectId(_parentCategoryId),
            _subcategory_Deleted_at: null
        });
        if (checkName) {
            return res.send({
                _status: false,
                _message: "Subcategory Name Already Used in this Category"
            });
        }

        // Check if subcategory order already exists within the same parent category
        let checkOrder = await subcategoryUseadd.findOne({
            _subcategoryOrder: _subcategoryOrder,
            _parentCategoryId: new ObjectId(_parentCategoryId),
            _subcategory_Deleted_at: null
        });
        if (checkOrder) {
            return res.send({
                _status: false,
                _message: "Subcategory Display Order Already Used in this Category"
            });
        }

        let insertObj = { ...req.body }

        if (req.file) {
            if (req.file.filename) {
                insertObj["image"] = req.file.filename
            }
        }

        let insertRes = await subcategoryUseadd.create(insertObj);

        let obj = {
            _status: true,
            _message: "Subcategory Created",
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

let subcategoryView = async (req, res) => {
    try {
        let data = await subcategoryUseadd.find({ _subcategory_Deleted_at: null })
            .populate('_parentCategoryId', '_categoryName');

        res.send({
            _status: true,
            _message: "Subcategory Viewed",
            path: process.env.SUBCATEGORYPATH,
            data
        });
    } catch (error) {
        return res.send({
            _status: false,
            _message: "Error occurred while fetching subcategories"
        });
    }
}

let getParentCategory = async (req, res) => {

    try {
        let data = await categoryUseadd.find({ _category_Deleted_at: null , _categoryStatus:true }).select("_categoryName");
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

let subcategoryDelete = async (req, res) => {
    try {
        let { ids } = req.body;

        let delRes = await subcategoryUseadd.updateMany(
            { _id: ids },
            { $set: { _subcategory_Deleted_at: Date.now() } }
        );

        return res.send({
            _status: true,
            _message: "Subcategory Deleted",
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

let subcategoryChangeStatus = async (req, res) => {
    try {
        let { ids } = req.body;

        await subcategoryUseadd.updateMany(
            { _id: ids },
            [
                {
                    $set: { _subcategoryStatus: { $not: "$_subcategoryStatus" } }
                }
            ],
            {
                updatePipeline: true
            }
        );

        return res.send({
            _status: true,
            _message: "Subcategory Status Changed"
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

let subcategoryUpdate = async (req, res) => {
    try {
        let { id } = req.params;
        let { _subcategoryName, _parentCategoryId, _subcategoryOrder } = req.body;

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

        // check subcategory name duplicate within same parent category
        let checkName = await subcategoryUseadd.findOne({
            _subcategoryName: _subcategoryName,
            _parentCategoryId: new ObjectId(_parentCategoryId),
            _subcategory_Deleted_at: null,
            _id: { $ne: new ObjectId(id) }
        });

        if (checkName) {
            return res.send({
                _status: false,
                _message: "Subcategory Name Already Used in this Parent Category"
            });
        }

        // check order duplicate within same parent category
        let checkOrder = await subcategoryUseadd.findOne({
            _subcategoryOrder: _subcategoryOrder,
            _parentCategoryId: new ObjectId(_parentCategoryId),
            _subcategory_Deleted_at: null,
            _id: { $ne: new ObjectId(id) }
        });

        if (checkOrder) {
            return res.send({
                _status: false,
                _message: "Subcategory Display Order Already Used in this Parent Category"
            });
        }

        let updateObj = { ...req.body };

        if (req.file) {
            if (req.file.filename) {
                updateObj["image"] = req.file.filename
            }
        }

        // update subcategory
        let updateRes = await subcategoryUseadd.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateObj }
        );

        return res.send({
            _status: true,
            _message: "Subcategory Updated Successfully",
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

let subcategoryViewOne = async (req, res) => {
    try {
        let { id } = req.params;

        let data = await subcategoryUseadd.findOne({
            _id: new ObjectId(id),
            _subcategory_Deleted_at: null
        }).populate('_parentCategoryId', '_categoryName');

        if (!data) {
            return res.send({
                _status: false,
                _message: "Subcategory not found"
            });
        }

        return res.send({
            _status: true,
            _message: "Subcategory Viewed",
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

module.exports = { subcategoryCreate, subcategoryView, getParentCategory, subcategoryDelete, subcategoryChangeStatus, subcategoryUpdate, subcategoryViewOne }