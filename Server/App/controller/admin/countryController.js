const { ObjectId } = require("mongodb");
const countryUseadd = require("../../model/countryModel");


// CREATE
let countryCreate = async (req, res) => {

    try {

        let { _countryName, _countryCode, _order } = req.body;

        let checkName = await countryUseadd.findOne({
            _countryName: _countryName,
            _countryDeletedAt: null
        });

        if (checkName) {
            return res.send({
                _status: false,
                _message: "Country Name Already Used"
            });
        }

        let checkCode = await countryUseadd.findOne({
            _countryCode: _countryCode,
            _countryDeletedAt: null
        });

        if (checkCode) {
            return res.send({
                _status: false,
                _message: "Country Code Already Used"
            });
        }

        let checkOrder = await countryUseadd.findOne({
            _order: _order,
            _countryDeletedAt: null
        });
        
        if (checkOrder) {
            return res.send({
                _status: false,
                _message: "Display Order Already Used"
            });
        }

        let insertRes = await countryUseadd.insertOne(req.body);

        return res.send({
            _status: true,
            _message: "Country Added",
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
let countryView = async (req, res) => {

    try {

        let data = await countryUseadd.find({
            _countryDeletedAt: null
        });

        return res.send({
            _status: true,
            _message: "Country Viewed",
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
let countryDelete = async (req, res) => {

    try {

        let { ids } = req.body

        let delRes = await countryUseadd.updateMany(

            { _id: ids },

            { $set: { _countryDeletedAt: Date.now() } }

        )

        return res.send({
            _status: true,
            _message: "Country Deleted",
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



// CHANGE STATUS
let countryChangeStatus = async (req, res) => {

    try {

        let { ids } = req.body

        await countryUseadd.updateMany(

            { _id: ids },

            [
                {
                    $set: { _status: { $not: "$_status" } }
                }
            ],
            {
                updatePipeline: true
            }

        )

        return res.send({
            _status: true,
            _message: "Country Status Changed",
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
let countryUpdate = async (req, res) => {

    try {

        let { id } = req.params;

        let { _countryName, _countryCode, _order } = req.body;


        let checkName = await countryUseadd.findOne({

            _countryName: _countryName,
            _countryDeletedAt: null,
            _id: { $ne: new ObjectId(id) }

        });

        if (checkName) {

            return res.send({
                _status: false,
                _message: "Country Name Already Used"
            });

        }


        let checkCode = await countryUseadd.findOne({

            _countryCode: _countryCode,
            _countryDeletedAt: null,
            _id: { $ne: new ObjectId(id) }

        });

        if (checkCode) {

            return res.send({
                _status: false,
                _message: "Country Code Already Used"
            });

        }


        let checkOrder = await countryUseadd.findOne({

            _order: _order,
            _countryDeletedAt: null,
            _id: { $ne: new ObjectId(id) }

        });

        if (checkOrder) {

            return res.send({
                _status: false,
                _message: "Display Order Already Used"
            });

        }


        let updateRes = await countryUseadd.updateOne(

            { _id: new ObjectId(id) },

            { $set: req.body }

        );


        return res.send({
            _status: true,
            _message: "Country Updated Successfully",
            updateRes
        });

    } catch (error) {

        let err = {}

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
let countryViewOne = async (req, res) => {

    try {

        let { id } = req.params;

        let data = await countryUseadd.findOne({

            _id: new ObjectId(id)

        });

        return res.send({
            _status: true,
            _message: "Country Viewed",
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

    countryCreate,
    countryView,
    countryDelete,
    countryUpdate,
    countryViewOne,
    countryChangeStatus

};