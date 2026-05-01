const { ObjectId } = require("mongodb");
const colorUseadd = require("../../model/colorModel");

// CREATE
let colorCreate = async (req, res) => {
    try {
        let { _colorName, _colorCode, _colorOrder } = req.body;

        let checkName = await colorUseadd.findOne({ _colorName: _colorName, _color_Deleted_at: null });
        if (checkName) {
            return res.send({
                _status: false,
                _message: "Color Name Already Used"
            });
        }

        let checkCode = await colorUseadd.findOne({ _colorCode: _colorCode, _color_Deleted_at: null });
        if (checkCode) {
            return res.send({
                _status: false,
                _message: "Color Code Already Used"
            });
        }
        let checkOrder = await colorUseadd.findOne({ _colorOrder: _colorOrder, _color_Deleted_at: null });
        if (checkOrder) {
            return res.send({
                _status: false,
                _message: "Color Display Order Already Used"
            });
        }

        let insertRes = await colorUseadd.insertOne(req.body);

        return res.send({
            _status: true,
            _message: "color Added",
            insertRes
        });

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
};

// VIEW ALL
let colorView = async (req, res) => {
    try {
        let data = await colorUseadd.find({ _color_Deleted_at: null });

        return res.send({
            _status: true,
            _message: "color Viewed",
            data
        });

    } catch (error) {
        let err = []
        for (let key in error.errors) {
            let obj = {}
            obj[key] = error.errors[key].message
            err.push(obj)
        }
        return res.send({
            _status: false,
            err
        });
    }
};

// DELETE
let colorDelete = async (req, res) => {
    try {

        //Parmanent Delete===>

        // let { id } = req.params;

        // let delRes = await colorUseadd.deleteOne({
        //     _id: new ObjectId(id)
        // });

        // return res.send({
        //     _status: true,
        //     _message: "color Deleted",
        //     delRes
        // });

        //Soft Delete ====>

        let { ids } = req.body
        console.log(ids)

        let delRes = await colorUseadd.updateMany(
            { _id: ids },
            { $set: { _color_Deleted_at: Date.now() } }
        )
        return res.send({
            _status: true,
            _message: "color Deleted",
            delRes
        });


    } catch (error) {
        let err = []
        for (let key in error.errors) {
            let obj = {}
            obj[key] = error.errors[key].message
            err.push(obj)
        }
        return res.send({
            _status: false,
            err
        });
    }
};

//colorChangeStatus
let colorChangeStatus = async (req, res) => {
    try {

        let { ids } = req.body

        await colorUseadd.updateMany(
            { _id: ids },
            [
                {
                    $set: { _colorStatus: { $not: "$_colorStatus" } }
                }
            ], {
            updatePipeline: true
        }
        )

        //normal process==>
        // for(let v of ids){

        //     let data = await colorUseadd.findOne({_id:v})
        //     let oldStatus = data._colorStatus
        //     await colorUseadd.updateOne({_id:v},{$set:{_colorStatus:!oldStatus}})
        // }

        //Companylevel process==>

        return res.send({
            _status: true,
            _message: "color Status Changed",
        });


    } catch (error) {
        let err = []
        for (let key in error.errors) {
            let obj = {}
            obj[key] = error.errors[key].message
            err.push(obj)
        }
        return res.send({
            _status: false,
            err
        });
    }
};


// UPDATE
let colorUpdate = async (req, res) => {
    try {

        let { id } = req.params;
        let { _colorName, _colorCode, _colorOrder } = req.body;

        // check color name duplicate
        let checkName = await colorUseadd.findOne({
            _colorName: _colorName,
            _color_Deleted_at: null,
            _id: { $ne: new ObjectId(id) }
        });

        if (checkName) {
            return res.send({
                _status: false,
                _message: "Color Name Already Used"
            });
        }

        // check color code duplicate
        let checkCode = await colorUseadd.findOne({
            _colorCode: _colorCode,
            _color_Deleted_at: null,
            _id: { $ne: new ObjectId(id) }
        });

        if (checkCode) {
            return res.send({
                _status: false,
                _message: "Color Code Already Used"
            });
        }

        // check order duplicate
        let checkOrder = await colorUseadd.findOne({
            _colorOrder: _colorOrder,
            _color_Deleted_at: null,
            _id: { $ne: new ObjectId(id) }
        });

        if (checkOrder) {
            return res.send({
                _status: false,
                _message: "Color Display Order Already Used"
            });
        }

        // update color
        let updateRes = await colorUseadd.updateOne(
            { _id: new ObjectId(id) },
            { $set: req.body }
        );

        return res.send({
            _status: true,
            _message: "Color Updated Successfully",
            updateRes
        });

    } catch (error) {

        let err = {};

        if (error.errors) {
            for (let key in error.errors) {
                err[key] = error.errors[key].message;
            }
        }

        return res.send({
            _status: false,
            err
        });
    }
};

// VIEW ONE
let colorViewOne = async (req, res) => {
    try {
        let { id } = req.params;

        let data = await colorUseadd.findOne({
            _id: new ObjectId(id)
        });

        return res.send({
            _status: true,
            _message: "color Viewed",
            data
        });

    } catch (error) {
        let err = []
        for (let key in error.errors) {
            let obj = {}
            obj[key] = error.errors[key].message
            err.push(obj)
        }
        return res.send({
            _status: false,
            err
        });
    }
};

module.exports = {
    colorCreate,
    colorView,
    colorDelete,
    colorUpdate,
    colorViewOne,
    colorChangeStatus
};