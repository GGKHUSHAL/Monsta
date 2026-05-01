const { ObjectId } = require("mongodb");
const faqUseadd = require("../../model/faqModel");

// CREATE
let faqCreate = async (req, res) => {
    try {
        let { _faqQuestion, _faqAnswere, _faqOrder } = req.body;

        let checkQuestion = await faqUseadd.findOne({ _faqQuestion: _faqQuestion, _faq_Deleted_at: null });
        if (checkQuestion) {
            return res.send({
                _status: false,
                _message: "faq Question Already Used"
            });
        }

        let checkAnswere = await faqUseadd.findOne({ _faqAnswere: _faqAnswere, _faq_Deleted_at: null });
        if (checkAnswere) {
            return res.send({
                _status: false,
                _message: "faq Answere Already Used"
            });
        }
        let checkOrder = await faqUseadd.findOne({ _faqOrder: _faqOrder, _faq_Deleted_at: null });
        if (checkOrder) {
            return res.send({
                _status: false,
                _message: "faq Display Order Already Used"
            });
        }

        let insertRes = await faqUseadd.insertOne(req.body);

        return res.send({
            _status: true,
            _message: "faq Added",
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
let faqView = async (req, res) => {
    try {
        let data = await faqUseadd.find({ _faq_Deleted_at: null });

        return res.send({
            _status: true,
            _message: "faq Viewed",
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
let faqDelete = async (req, res) => {
    try {

        //Parmanent Delete===>

        // let { id } = req.params;

        // let delRes = await faqUseadd.deleteOne({
        //     _id: new ObjectId(id)
        // });

        // return res.send({
        //     _status: true,
        //     _message: "faq Deleted",
        //     delRes
        // });

        //Soft Delete ====>

        let { ids } = req.body
        console.log(ids)

        let delRes = await faqUseadd.updateMany(
            { _id: ids },
            { $set: { _faq_Deleted_at: Date.now() } }
        )
        return res.send({
            _status: true,
            _message: "faq Deleted",
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

//faqChangeStatus
let faqChangeStatus = async (req, res) => {
    try {

        let { ids } = req.body

        await faqUseadd.updateMany(
            { _id: ids },
            [
                {
                    $set: { _faqStatus: { $not: "$_faqStatus" } }
                }
            ], {
            updatePipeline: true
        }
        )

        //normal process==>
        // for(let v of ids){

        //     let data = await faqUseadd.findOne({_id:v})
        //     let oldStatus = data._faqStatus
        //     await faqUseadd.updateOne({_id:v},{$set:{_faqStatus:!oldStatus}})
        // }

        //Companylevel process==>

        return res.send({
            _status: true,
            _message: "faq Status Changed",
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
let faqUpdate = async (req, res) => {
    try {

        let { id } = req.params;
        let { _faqQuestion, _faqAnswere, _faqOrder } = req.body;

        // check faq Question duplicate
        let checkQuestion = await faqUseadd.findOne({
            _faqQuestion: _faqQuestion,
            _faq_Deleted_at: null,
            _id: { $ne: new ObjectId(id) }
        });

        if (checkQuestion) {
            return res.send({
                _status: false,
                _message: "faq Question Already Used"
            });
        }

        // check faq Answere duplicate
        let checkAnswere = await faqUseadd.findOne({
            _faqAnswere: _faqAnswere,
            _faq_Deleted_at: null,
            _id: { $ne: new ObjectId(id) }
        });

        if (checkAnswere) {
            return res.send({
                _status: false,
                _message: "faq Answere Already Used"
            });
        }

        // check order duplicate
        let checkOrder = await faqUseadd.findOne({
            _faqOrder: _faqOrder,
            _faq_Deleted_at: null,
            _id: { $ne: new ObjectId(id) }
        });

        if (checkOrder) {
            return res.send({
                _status: false,
                _message: "faq Display Order Already Used"
            });
        }

        // update faq
        let updateRes = await faqUseadd.updateOne(
            { _id: new ObjectId(id) },
            { $set: req.body }
        );

        return res.send({
            _status: true,
            _message: "faq Updated Successfully",
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
let faqViewOne = async (req, res) => {
    try {
        let { id } = req.params;

        let data = await faqUseadd.findOne({
            _id: new ObjectId(id)
        });

        return res.send({
            _status: true,
            _message: "faq Viewed",
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
    faqCreate,
    faqView,
    faqDelete,
    faqUpdate,
    faqViewOne,
    faqChangeStatus
};