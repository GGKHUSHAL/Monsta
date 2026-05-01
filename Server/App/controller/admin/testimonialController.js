const { ObjectId } = require("mongodb");
const testimonialUseadd = require("../../model/testimonialModel");

// CREATE
let testimonialCreate = async (req, res) => {
    try {
        let {
            _testimonialName,
            _testimonialOrder
        } = req.body;

        // duplicate name check
        const regex = new RegExp(
            `^${_testimonialName.trim()}$`,
            "i"
        );

        let checkName = await testimonialUseadd.findOne({
            _testimonialName: regex,
            _testimonial_Deleted_at: null
        });

        if (checkName) {
            return res.send({
                _status: false,
                _message: "Testimonial Name Already Used"
            });
        }

        // duplicate order check
        let checkOrder = await testimonialUseadd.findOne({
            _testimonialOrder,
            _testimonial_Deleted_at: null
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
            await testimonialUseadd.create(insertObj);

        return res.send({
            _status: true,
            _message: "Testimonial Created",
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
let testimonialView = async (req, res) => {
    try {
        let data = await testimonialUseadd.find({
            _testimonial_Deleted_at: null
        });

        return res.send({
            _status: true,
            _message: "Testimonial Viewed",
            path: process.env.TESTIMONIALPATH,
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
let testimonialDelete = async (req, res) => {
    try {
        let { ids } = req.body;

        let delRes =
            await testimonialUseadd.updateMany(
                { _id: ids },
                {
                    $set: {
                        _testimonial_Deleted_at: Date.now()
                    }
                }
            );

        return res.send({
            _status: true,
            _message: "Testimonial Deleted",
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

let testimonialChangeStatus = async (req, res) => {
    try {
        let { ids } = req.body;

        if (!ids || ids.length === 0) {
            return res.send({
                _status: false,
                _message: "Please Select Data"
            });
        }

        // first get selected rows
        let rows = await testimonialUseadd.find({
            _id: { $in: ids }
        });

        // toggle one by one
        for (let item of rows) {
            await testimonialUseadd.updateOne(
                { _id: item._id },
                {
                    $set: {
                        _testimonialStatus: !item._testimonialStatus
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
let testimonialUpdate = async (req, res) => {
    try {
        let { id } = req.params;

        let {
            _testimonialName,
            _testimonialOrder
        } = req.body;

        // duplicate name
        let checkName =
            await testimonialUseadd.findOne({
                _testimonialName,
                _testimonial_Deleted_at: null,
                _id: { $ne: new ObjectId(id) }
            });

        if (checkName) {
            return res.send({
                _status: false,
                _message:
                    "Testimonial Name Already Used"
            });
        }

        // duplicate order
        let checkOrder =
            await testimonialUseadd.findOne({
                _testimonialOrder,
                _testimonial_Deleted_at: null,
                _id: { $ne: new ObjectId(id) }
            });

        if (checkOrder) {
            return res.send({
                _status: false,
                _message:
                    "Display Order Already Used"
            });
        }

        let updateObj = { ...req.body };

        if (req.file) {
            if (req.file.filename) {
                updateObj.image = req.file.filename;
            }
        }

        let updateRes =
            await testimonialUseadd.updateOne(
                { _id: new ObjectId(id) },
                { $set: updateObj }
            );

        return res.send({
            _status: true,
            _message:
                "Testimonial Updated Successfully",
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
let testimonialViewOne = async (req, res) => {
    try {
        let { id } = req.params;

        let data =
            await testimonialUseadd.findOne({
                _id: new ObjectId(id),
                _testimonial_Deleted_at: null
            });

        if (!data) {
            return res.send({
                _status: false,
                _message:
                    "Testimonial not found"
            });
        }

        return res.send({
            _status: true,
            _message:
                "Testimonial Viewed",
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
    testimonialCreate,
    testimonialView,
    testimonialDelete,
    testimonialChangeStatus,
    testimonialUpdate,
    testimonialViewOne
};