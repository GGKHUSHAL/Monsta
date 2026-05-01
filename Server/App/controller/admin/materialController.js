const { ObjectId } = require("mongodb");
const materialUseadd = require("../../model/materialModel");

// CREATE
let materialCreate = async (req, res) => {
    try {
        let {
            _materialName,
            _materialOrder
        } = req.body;

        // duplicate name check
        const regex = new RegExp(
            `^${_materialName.trim()}$`,
            "i"
        );

        let checkName = await materialUseadd.findOne({
            _materialName: regex,
            _material_Deleted_at: null
        });

        if (checkName) {
            return res.send({
                _status: false,
                _message: "Material Name Already Used"
            });
        }

        // duplicate order check
        let checkOrder = await materialUseadd.findOne({
            _materialOrder,
            _material_Deleted_at: null
        });

        if (checkOrder) {
            return res.send({
                _status: false,
                _message: "Display Order Already Used"
            });
        }

        let insertObj = { ...req.body };

        if (req.file) {
            if (req.file.filename) {
                insertObj.image = req.file.filename;
            }
        }

        let insertRes =
            await materialUseadd.create(insertObj);

        return res.send({
            _status: true,
            _message: "Material Created Successfully",
            insertRes
        });

    } catch (error) {
        let err = {};

        for (let key in error.errors) {
            err[key] = error.errors[key].message;
        }

        return res.send({
            _status: false,
            err
        });
    }
};

// VIEW ALL
let materialView = async (req, res) => {
    try {
        let data = await materialUseadd.find({
            _material_Deleted_at: null
        });

        return res.send({
            _status: true,
            _message: "Material Viewed",
            path: process.env.MATERIALPATH,
            data
        });

    } catch (error) {
        return res.send({
            _status: false,
            _message: "Error while fetching data"
        });
    }
};

// DELETE
let materialDelete = async (req, res) => {
    try {
        let { ids } = req.body;

        let delRes =
            await materialUseadd.updateMany(
                { _id: ids },
                {
                    $set: {
                        _material_Deleted_at: Date.now()
                    }
                }
            );

        return res.send({
            _status: true,
            _message: "Material Deleted Successfully",
            delRes
        });

    } catch (error) {
        return res.send({
            _status: false,
            _message: "Something went wrong"
        });
    }
};

// STATUS CHANGE
let materialChangeStatus = async (req, res) => {
    try {
        let { ids } = req.body;

        if (!ids || ids.length === 0) {
            return res.send({
                _status: false,
                _message: "Please Select Data"
            });
        }

        let rows = await materialUseadd.find({
            _id: { $in: ids }
        });

        for (let item of rows) {
            await materialUseadd.updateOne(
                { _id: item._id },
                {
                    $set: {
                        _materialStatus: !item._materialStatus
                    }
                }
            );
        }

        return res.send({
            _status: true,
            _message: "Status Changed Successfully"
        });

    } catch (error) {
        console.log(error);

        return res.send({
            _status: false,
            _message: "Something went wrong"
        });
    }
};

// UPDATE
let materialUpdate = async (req, res) => {
    try {
        let { id } = req.params;

        let {
            _materialName,
            _materialOrder
        } = req.body;

        // duplicate name
        let checkName =
            await materialUseadd.findOne({
                _materialName,
                _material_Deleted_at: null,
                _id: { $ne: new ObjectId(id) }
            });

        if (checkName) {
            return res.send({
                _status: false,
                _message: "Material Name Already Used"
            });
        }

        // duplicate order
        let checkOrder =
            await materialUseadd.findOne({
                _materialOrder,
                _material_Deleted_at: null,
                _id: { $ne: new ObjectId(id) }
            });

        if (checkOrder) {
            return res.send({
                _status: false,
                _message: "Display Order Already Used"
            });
        }

        let updateObj = { ...req.body };

        if (req.file) {
            if (req.file.filename) {
                updateObj.image = req.file.filename;
            }
        }

        updateObj._material_Updated_at =
            new Date();

        let updateRes =
            await materialUseadd.updateOne(
                { _id: new ObjectId(id) },
                { $set: updateObj }
            );

        return res.send({
            _status: true,
            _message: "Material Updated Successfully",
            updateRes
        });

    } catch (error) {
        return res.send({
            _status: false,
            _message: "Something went wrong"
        });
    }
};

// VIEW ONE
let materialViewOne = async (req, res) => {
    try {
        let { id } = req.params;

        let data =
            await materialUseadd.findOne({
                _id: new ObjectId(id),
                _material_Deleted_at: null
            });

        if (!data) {
            return res.send({
                _status: false,
                _message: "Data not found"
            });
        }

        return res.send({
            _status: true,
            _message: "Material Viewed",
            data
        });

    } catch (error) {
        return res.send({
            _status: false,
            _message: "Something went wrong"
        });
    }
};

module.exports = {
    materialCreate,
    materialView,
    materialDelete,
    materialChangeStatus,
    materialUpdate,
    materialViewOne
};