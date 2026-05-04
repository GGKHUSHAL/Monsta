const userUseadd = require("../../model/userModel");

const buildErrorObject = (error) => {
  let err = {};

  if (error.errors) {
    for (let key in error.errors) {
      err[key] = error.errors[key].message;
    }
  }

  return err;
};

const userView = async (req, res) => {
  try {
    const data = await userUseadd
      .find({ deleted_at: null })
      .select("-password")
      .sort({ created_at: -1 });

    return res.send({
      _status: true,
      _message: "Users Viewed",
      data,
    });
  } catch (error) {
    return res.send({
      _status: false,
      _message: "Something went wrong",
      err: buildErrorObject(error),
    });
  }
};

module.exports = { userView };
