const { ObjectId } = require("mongodb");
const aboutWhyChooseUseadd = require("../../model/aboutWhyChooseModel");

let aboutWhyChooseCreate = async (req, res) => {
  try {
    let { _aboutWhyChooseTitle, _aboutWhyChooseOrder } = req.body;

    const regex = new RegExp(`^${_aboutWhyChooseTitle.trim()}$`, "i");

    let checkTitle = await aboutWhyChooseUseadd.findOne({
      _aboutWhyChooseTitle: regex,
      _aboutWhyChoose_Deleted_at: null
    });

    if (checkTitle) {
      return res.send({
        _status: false,
        _message: "Title Already Used"
      });
    }

    let checkOrder = await aboutWhyChooseUseadd.findOne({
      _aboutWhyChooseOrder,
      _aboutWhyChoose_Deleted_at: null
    });

    if (checkOrder) {
      return res.send({
        _status: false,
        _message: "Display Order Already Used"
      });
    }

    let insertObj = { ...req.body };

    if (req.file?.filename) {
      insertObj.image = req.file.filename;
    }

    let insertRes = await aboutWhyChooseUseadd.create(insertObj);

    return res.send({
      _status: true,
      _message: "About Why Choose Us Created",
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

let aboutWhyChooseView = async (req, res) => {
  try {
    let data = await aboutWhyChooseUseadd
      .find({
        _aboutWhyChoose_Deleted_at: null
      })
      .sort({
        _aboutWhyChooseOrder: 1
      });

    return res.send({
      _status: true,
      _message: "About Why Choose Us Viewed",
      path: process.env.ABOUTWHYCHOOSEPATH || "http://localhost:8000/uploads/aboutwhychooseus/",
      data
    });
  } catch (error) {
    return res.send({
      _status: false,
      _message: "Error while fetching data"
    });
  }
};

let aboutWhyChooseDelete = async (req, res) => {
  try {
    let { ids } = req.body;

    let delRes = await aboutWhyChooseUseadd.updateMany(
      { _id: ids },
      {
        $set: {
          _aboutWhyChoose_Deleted_at: Date.now()
        }
      }
    );

    return res.send({
      _status: true,
      _message: "About Why Choose Us Deleted",
      delRes
    });
  } catch (error) {
    return res.send({
      _status: false,
      _message: "Something went wrong"
    });
  }
};

let aboutWhyChooseChangeStatus = async (req, res) => {
  try {
    let { ids } = req.body;

    if (!ids || ids.length === 0) {
      return res.send({
        _status: false,
        _message: "Please Select Data"
      });
    }

    let rows = await aboutWhyChooseUseadd.find({
      _id: { $in: ids }
    });

    for (let item of rows) {
      await aboutWhyChooseUseadd.updateOne(
        { _id: item._id },
        {
          $set: {
            _aboutWhyChooseStatus: !item._aboutWhyChooseStatus
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

let aboutWhyChooseUpdate = async (req, res) => {
  try {
    let { id } = req.params;
    let { _aboutWhyChooseTitle, _aboutWhyChooseOrder } = req.body;

    let checkTitle = await aboutWhyChooseUseadd.findOne({
      _aboutWhyChooseTitle,
      _aboutWhyChoose_Deleted_at: null,
      _id: { $ne: new ObjectId(id) }
    });

    if (checkTitle) {
      return res.send({
        _status: false,
        _message: "Title Already Used"
      });
    }

    let checkOrder = await aboutWhyChooseUseadd.findOne({
      _aboutWhyChooseOrder,
      _aboutWhyChoose_Deleted_at: null,
      _id: { $ne: new ObjectId(id) }
    });

    if (checkOrder) {
      return res.send({
        _status: false,
        _message: "Display Order Already Used"
      });
    }

    let updateObj = { ...req.body };

    if (req.file?.filename) {
      updateObj.image = req.file.filename;
    }

    updateObj._aboutWhyChoose_Updated_at = new Date();

    let updateRes = await aboutWhyChooseUseadd.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateObj }
    );

    return res.send({
      _status: true,
      _message: "About Why Choose Us Updated Successfully",
      updateRes
    });
  } catch (error) {
    return res.send({
      _status: false,
      _message: "Something went wrong"
    });
  }
};

let aboutWhyChooseViewOne = async (req, res) => {
  try {
    let { id } = req.params;

    let data = await aboutWhyChooseUseadd.findOne({
      _id: new ObjectId(id),
      _aboutWhyChoose_Deleted_at: null
    });

    if (!data) {
      return res.send({
        _status: false,
        _message: "Data not found"
      });
    }

    return res.send({
      _status: true,
      _message: "About Why Choose Us Viewed",
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
  aboutWhyChooseCreate,
  aboutWhyChooseView,
  aboutWhyChooseDelete,
  aboutWhyChooseChangeStatus,
  aboutWhyChooseUpdate,
  aboutWhyChooseViewOne
};
