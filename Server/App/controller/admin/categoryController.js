let express = require("express")
const { ObjectId } = require("mongodb");
const categoryUseadd = require("../../model/categoryModel");
const { createSlug } = require("../../config/helper");

let categoryCreate = async (req, res) => {
    try {

        let { _categoryName, _categoryOrder } = req.body;

        const regex = new RegExp(`^${_categoryName.trim()}$`, 'i'); // Case-insensitive regex for exact match
        // Check if category name already exists
        let checkName = await categoryUseadd.findOne({ _categoryName: regex, _category_Deleted_at: null });
        if (checkName) {
            return res.send({
                _status: false,
                _message: "Category Name Already Used"
            });
        }

        // Check if category order already exists
        let checkOrder = await categoryUseadd.findOne({ _categoryOrder: _categoryOrder, _category_Deleted_at: null });
        if (checkOrder) {
            return res.send({
                _status: false,
                _message: "Category Display Order Already Used"
            });
        }

        let insertObj = { ...req.body }

        if (req.file) {
            if (req.file.filename) {
                insertObj["image"] = req.file.filename
            }
        }
        
        let slug = createSlug(_categoryName);
        insertObj.slug = slug;

        let insertRes = await categoryUseadd.create(insertObj);
        let obj = {
            _status: true,
            _message: "Category Created",
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

let categoryView = async (req, res) => {
    try {
        let data = await categoryUseadd.find({ _category_Deleted_at: null });
        res.send({
            _status: true,
            _message: "Category Viewed",
            path: process.env.CATEGORYPATH,
            data
        });
    } catch (error) {
        return res.send({
            _status: false,
            _message: "Error occurred while fetching categories"
        });
    }
}

let categoryDelete = async (req, res) => {
    try {
        let { ids } = req.body;

        let delRes = await categoryUseadd.updateMany(
            { _id: ids },
            { $set: { _category_Deleted_at: Date.now() } }
        );

        return res.send({
            _status: true,
            _message: "Category Deleted",
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

let categoryChangeStatus = async (req, res) => {
    try {
        let { ids } = req.body;

        await categoryUseadd.updateMany(
            { _id: ids },
            [
                {
                    $set: { _categoryStatus: { $not: "$_categoryStatus" } }
                }
            ],
            {
                updatePipeline: true
            }
        );

        return res.send({
            _status: true,
            _message: "Category Status Changed"
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

let categoryUpdate = async (req, res) => {
    try {
        let { id } = req.params;
        let { _categoryName, _categoryOrder } = req.body;

        // check category name duplicate
        let checkName = await categoryUseadd.findOne({
            _categoryName: _categoryName,
            _category_Deleted_at: null,
            _id: { $ne: new ObjectId(id) }
        });

        if (checkName) {
            return res.send({
                _status: false,
                _message: "Category Name Already Used"
            });
        }

        // check order duplicate
        let checkOrder = await categoryUseadd.findOne({
            _categoryOrder: _categoryOrder,
            _category_Deleted_at: null,
            _id: { $ne: new ObjectId(id) }
        });

        if (checkOrder) {
            return res.send({
                _status: false,
                _message: "Category Display Order Already Used"
            });
        }

        let updateObj = { ...req.body };

        if (req.file) {
            if (req.file.filename) {
                updateObj["image"] = req.file.filename
            }
        }

        // update category
        let updateRes = await categoryUseadd.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateObj }
        );

        return res.send({
            _status: true,
            _message: "Category Updated Successfully",
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

let categoryViewOne = async (req, res) => {
    try {
        let { id } = req.params;

        let data = await categoryUseadd.findOne({
            _id: new ObjectId(id),
            _category_Deleted_at: null
        });

        if (!data) {
            return res.send({
                _status: false,
                _message: "Category not found"
            });
        }

        return res.send({
            _status: true,
            _message: "Category Viewed",
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

module.exports = { categoryCreate, categoryView, categoryDelete, categoryChangeStatus, categoryUpdate, categoryViewOne }
