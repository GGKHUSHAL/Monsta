const { ObjectId } = require("mongodb");
const sliderUseadd = require("../../model/sliderModel");

// CREATE
let sliderCreate = async (req, res) => {
    try {
        let {
            _sliderTitle,
            _sliderOrder
        } = req.body;

        // duplicate title check
        const regex = new RegExp(
            `^${_sliderTitle.trim()}$`,
            "i"
        );

        let checkTitle = await sliderUseadd.findOne({
            _sliderTitle: regex,
            _slider_Deleted_at: null
        });

        if (checkTitle) {
            return res.send({
                _status: false,
                _message: "Title Already Used"
            });
        }

        // duplicate order check
        let checkOrder = await sliderUseadd.findOne({
            _sliderOrder,
            _slider_Deleted_at: null
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
            await sliderUseadd.create(insertObj);

        return res.send({
            _status: true,
            _message: "Slider Created Successfully",
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
let sliderView = async (req, res) => {
    try {
        let data = await sliderUseadd.find({
            _slider_Deleted_at: null
        });

        return res.send({
            _status: true,
            _message: "Slider Viewed Successfully",
            path: process.env.SLIDERPATH,
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
let sliderDelete = async (req, res) => {
    try {
        let { ids } = req.body;

        let delRes =
            await sliderUseadd.updateMany(
                { _id: ids },
                {
                    $set: {
                        _slider_Deleted_at: Date.now()
                    }
                }
            );

        return res.send({
            _status: true,
            _message: "Slider Deleted Successfully",
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
let sliderChangeStatus = async (req, res) => {
    try {
        let { ids } = req.body;

        if (!ids || ids.length === 0) {
            return res.send({
                _status: false,
                _message: "Please Select Data"
            });
        }

        let rows = await sliderUseadd.find({
            _id: { $in: ids }
        });

        for (let item of rows) {
            await sliderUseadd.updateOne(
                { _id: item._id },
                {
                    $set: {
                        _sliderStatus: !item._sliderStatus
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
let sliderUpdate = async (req, res) => {
    try {
        let { id } = req.params;

        let {
            _sliderTitle,
            _sliderOrder
        } = req.body;

        // duplicate title
        let checkTitle =
            await sliderUseadd.findOne({
                _sliderTitle,
                _slider_Deleted_at: null,
                _id: { $ne: new ObjectId(id) }
            });

        if (checkTitle) {
            return res.send({
                _status: false,
                _message: "Title Already Used"
            });
        }

        // duplicate order
        let checkOrder =
            await sliderUseadd.findOne({
                _sliderOrder,
                _slider_Deleted_at: null,
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

        updateObj._slider_Updated_at =
            new Date();

        let updateRes =
            await sliderUseadd.updateOne(
                { _id: new ObjectId(id) },
                { $set: updateObj }
            );

        return res.send({
            _status: true,
            _message: "Slider Updated Successfully",
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
let sliderViewOne = async (req, res) => {
    try {
        let { id } = req.params;

        let data =
            await sliderUseadd.findOne({
                _id: new ObjectId(id),
                _slider_Deleted_at: null
            });

        if (!data) {
            return res.send({
                _status: false,
                _message: "Data not found"
            });
        }

        return res.send({
            _status: true,
            _message: "Slider Viewed Successfully",
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
    sliderCreate,
    sliderView,
    sliderDelete,
    sliderChangeStatus,
    sliderUpdate,
    sliderViewOne
};