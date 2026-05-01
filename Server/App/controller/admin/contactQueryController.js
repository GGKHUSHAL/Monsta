const { ObjectId } = require("mongodb");
const contactQueryUseadd = require("../../model/contactQueryModel");
const { transporter } = require("../../config/helper");

const buildErrorObject = (error) => {
  let err = {};

  if (error.errors) {
    for (let key in error.errors) {
      err[key] = error.errors[key].message;
    }
  }

  return err;
};

let contactQueryCreate = async (req, res) => {
  try {
    let { name, email, mobile, subject, message } = req.body;

    let insertRes = await contactQueryUseadd.create({
      name,
      email,
      mobile,
      subject,
      message,
    });

    await transporter.sendMail({
      from: '"Monsta E-COM" <khushalchoudhary116@gmail.com>',
      to: email,
      subject: "We Received Your Query - Monsta E-COM",
      text: "Thank you for contacting Monsta E-COM. We have received your query and will contact you as soon as possible.",
      html: `
        <div style="font-family: Arial, sans-serif; background:#f5f5f5; padding:24px;">
          <div style="max-width:620px; margin:auto; background:#ffffff; border-radius:8px; overflow:hidden; border:1px solid #eeeeee;">
            <div style="background:#c09578; color:#ffffff; padding:20px; text-align:center;">
              <h1 style="margin:0; font-size:24px;">Monsta E-COM</h1>
            </div>
            <div style="padding:28px; color:#333333;">
              <h2 style="margin-top:0;">Query Received</h2>
              <p>Hi ${name},</p>
              <p>Thank you for contacting us. We have received your query and our team will contact you as soon as possible.</p>
              <div style="background:#fafafa; border-left:4px solid #c09578; padding:14px; margin:20px 0;">
                <p style="margin:0 0 8px;"><strong>Subject:</strong> ${subject}</p>
                <p style="margin:0;"><strong>Message:</strong> ${message}</p>
              </div>
              <p>Regards,<br/>Monsta E-COM Team</p>
            </div>
            <div style="background:#f1f1f1; padding:14px; text-align:center; color:#777777; font-size:12px;">
              © ${new Date().getFullYear()} Monsta E-COM. All rights reserved.
            </div>
          </div>
        </div>
      `,
    });

    await contactQueryUseadd.updateOne(
      { _id: insertRes._id },
      { $set: { acknowledgement_sent_at: Date.now(), updated_at: Date.now() } }
    );

    return res.send({
      _status: true,
      _message: "Query Submitted Successfully",
      data: insertRes,
    });
  } catch (error) {
    return res.send({
      _status: false,
      _message: "Validation Error",
      err: buildErrorObject(error),
    });
  }
};

let contactQueryReply = async (req, res) => {
  try {
    let { id, subject, message, closeQuery } = req.body;

    if (!id || !subject || !message) {
      return res.send({
        _status: false,
        _message: "Query, subject and message are required",
      });
    }

    let queryData = await contactQueryUseadd.findOne({
      _id: new ObjectId(id),
      deleted_at: null,
    });

    if (!queryData) {
      return res.send({
        _status: false,
        _message: "Contact query not found",
      });
    }

    await transporter.sendMail({
      from: '"Monsta E-COM" <khushalchoudhary116@gmail.com>',
      to: queryData.email,
      subject,
      text: message,
      html: `
        <div style="font-family: Arial, sans-serif; background:#f5f5f5; padding:24px;">
          <div style="max-width:620px; margin:auto; background:#ffffff; border-radius:8px; overflow:hidden; border:1px solid #eeeeee;">
            <div style="background:#c09578; color:#ffffff; padding:20px; text-align:center;">
              <h1 style="margin:0; font-size:24px;">Monsta E-COM</h1>
            </div>
            <div style="padding:28px; color:#333333;">
              <p>Hi ${queryData.name},</p>
              <div style="line-height:1.7; white-space:pre-line;">${message}</div>
              <hr style="border:none; border-top:1px solid #eeeeee; margin:24px 0;" />
              <p style="font-size:13px; color:#777777;">
                Your original query: <strong>${queryData.subject}</strong>
              </p>
              <p>Regards,<br/>Monsta E-COM Team</p>
            </div>
          </div>
        </div>
      `,
    });

    await contactQueryUseadd.updateOne(
      { _id: queryData._id },
      {
        $set: {
          reply_subject: subject,
          reply_message: message,
          reply_sent_at: Date.now(),
          status: closeQuery ? false : queryData.status,
          updated_at: Date.now(),
        },
      }
    );

    return res.send({
      _status: true,
      _message: "Reply mail sent successfully",
    });
  } catch (error) {
    console.log(error);
    return res.send({
      _status: false,
      _message: "Mail could not be sent",
      err: buildErrorObject(error),
    });
  }
};

let contactQueryView = async (req, res) => {
  try {
    let data = await contactQueryUseadd
      .find({ deleted_at: null })
      .sort({ created_at: -1 });

    return res.send({
      _status: true,
      _message: "Contact Queries Viewed",
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

let contactQueryViewOne = async (req, res) => {
  try {
    let { id } = req.params;

    let data = await contactQueryUseadd.findOne({
      _id: new ObjectId(id),
      deleted_at: null,
    });

    return res.send({
      _status: true,
      _message: "Contact Query Viewed",
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

let contactQueryDelete = async (req, res) => {
  try {
    let { ids } = req.body;

    let delRes = await contactQueryUseadd.updateMany(
      { _id: { $in: ids } },
      { $set: { deleted_at: Date.now(), updated_at: Date.now() } }
    );

    return res.send({
      _status: true,
      _message: "Contact Query Deleted",
      delRes,
    });
  } catch (error) {
    return res.send({
      _status: false,
      _message: "Something went wrong",
      err: buildErrorObject(error),
    });
  }
};

let contactQueryChangeStatus = async (req, res) => {
  try {
    let { ids } = req.body;

    await contactQueryUseadd.updateMany(
      { _id: { $in: ids } },
      [
        {
          $set: {
            status: { $not: "$status" },
            updated_at: new Date(),
          },
        },
      ],
      {
        updatePipeline: true,
      }
    );

    return res.send({
      _status: true,
      _message: "Contact Query Status Changed",
    });
  } catch (error) {
    return res.send({
      _status: false,
      _message: "Something went wrong",
      err: buildErrorObject(error),
    });
  }
};

module.exports = {
  contactQueryCreate,
  contactQueryView,
  contactQueryViewOne,
  contactQueryDelete,
  contactQueryChangeStatus,
  contactQueryReply,
};
