const { ObjectId } = require("mongodb");
const contactQueryUseadd = require("../../model/contactQueryModel");

let contactQueryCreate = async (req, res) => {
  try {
    let insertRes = await contactQueryUseadd.create(req.body);

    return res.send({
      _status: true,
      _message: "Your query has been submitted successfully",
      insertRes
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
      _message: "Please check the form fields",
      err
    });
  }
};

let contactQueryView = async (req, res) => {
  try {
    let data = await contactQueryUseadd
      .find({
        deleted_at: null
      })
      .sort({
        created_at: -1
      });

    return res.send({
      _status: true,
      _message: "Contact Queries Fetched Successfully",
      data
    });
  } catch (error) {
    return res.send({
      _status: false,
      _message: "Error while fetching contact queries"
    });
  }
};

let contactQueryDelete = async (req, res) => {
  try {
    let { ids } = req.body;

    let delRes = await contactQueryUseadd.updateMany(
      { _id: ids },
      {
        $set: {
          deleted_at: Date.now()
        }
      }
    );

    return res.send({
      _status: true,
      _message: "Contact Query Deleted Successfully",
      delRes
    });
  } catch (error) {
    return res.send({
      _status: false,
      _message: "Something went wrong"
    });
  }
};

let contactQueryChangeStatus = async (req, res) => {
  try {
    let { ids } = req.body;

    if (!ids || ids.length === 0) {
      return res.send({
        _status: false,
        _message: "Please Select Data"
      });
    }

    let rows = await contactQueryUseadd.find({
      _id: { $in: ids }
    });

    for (let item of rows) {
      await contactQueryUseadd.updateOne(
        { _id: item._id },
        {
          $set: {
            status: !item.status,
            updated_at: new Date()
          }
        }
      );
    }

    return res.send({
      _status: true,
      _message: "Status Changed Successfully"
    });
  } catch (error) {
    return res.send({
      _status: false,
      _message: "Something went wrong"
    });
  }
};

let contactQueryViewOne = async (req, res) => {
  try {
    let { id } = req.params;

    let data = await contactQueryUseadd.findOne({
      _id: new ObjectId(id),
      deleted_at: null
    });

    if (!data) {
      return res.send({
        _status: false,
        _message: "Contact query not found"
      });
    }

    return res.send({
      _status: true,
      _message: "Contact Query Fetched Successfully",
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
  contactQueryCreate,
  contactQueryView,
  contactQueryDelete,
  contactQueryChangeStatus,
  contactQueryViewOne
};
