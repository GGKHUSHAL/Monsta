const { ObjectId } = require("mongodb");
const crypto = require("crypto");
const newsletterUseadd = require("../../model/newsletterModel");
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

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const frontendBaseUrl =
  process.env.FRONTEND_URL || process.env.WEBSITE_URL || "http://localhost:3000";
const unsubscribeSecret =
  process.env.NEWSLETTER_UNSUBSCRIBE_SECRET || "monsta-newsletter-secret";

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const createUnsubscribeToken = (email) =>
  crypto
    .createHmac("sha256", unsubscribeSecret)
    .update(email)
    .digest("hex");

const buildUnsubscribeUrl = (email) => {
  let normalizedEmail = email.toLowerCase().trim();
  let token = createUnsubscribeToken(normalizedEmail);

  return `${frontendBaseUrl.replace(/\/$/, "")}/newsletter/unsubscribe?email=${encodeURIComponent(
    normalizedEmail
  )}&token=${token}`;
};

const isValidUnsubscribeToken = (email, token) => {
  if (!email || !token) return false;

  let expectedToken = createUnsubscribeToken(email);
  let providedToken = String(token);

  if (providedToken.length !== expectedToken.length) return false;

  return crypto.timingSafeEqual(
    Buffer.from(expectedToken),
    Buffer.from(providedToken)
  );
};

let newsletterSubscribe = async (req, res) => {
  try {
    let { email } = req.body;
    email = email?.toLowerCase()?.trim();

    if (!emailRegex.test(email || "")) {
      return res.send({
        _status: false,
        _message: "Please enter a valid email address",
      });
    }

    let existingSubscriber = await newsletterUseadd.findOne({
      email,
      deleted_at: null,
    });

    if (existingSubscriber) {
      if (!existingSubscriber.status) {
        existingSubscriber.status = true;
        existingSubscriber.updated_at = Date.now();
        await existingSubscriber.save();

        return res.send({
          _status: true,
          _message: "Newsletter subscription activated again",
          data: existingSubscriber,
        });
      }

      return res.send({
        _status: false,
        _message: "This email is already subscribed to our newsletter",
      });
    }

    let subscriber = await newsletterUseadd.create({ email });
    let unsubscribeUrl = buildUnsubscribeUrl(email);

    await transporter.sendMail({
      from: '"Monsta E-COM" <khushalchoudhary116@gmail.com>',
      to: email,
      subject: "Welcome to Monsta E-COM Newsletter",
      text: "You will receive updates about our latest shop arrivals and special offers.",
      html: `
        <div style="font-family: Arial, sans-serif; background:#f5f5f5; padding:24px;">
          <div style="max-width:620px; margin:auto; background:#ffffff; border-radius:8px; overflow:hidden; border:1px solid #eeeeee;">
            <div style="background:#c09578; color:#ffffff; padding:22px; text-align:center;">
              <h1 style="margin:0; font-size:24px;">Monsta E-COM</h1>
              <p style="margin:8px 0 0;">You're on the list</p>
            </div>
            <div style="padding:28px; color:#333333; text-align:center;">
              <h2 style="margin-top:0;">Thanks for subscribing!</h2>
              <p style="font-size:15px; line-height:1.7;">
                You will receive updates about our latest shop arrivals, hand-picked furniture ideas,
                seasonal collections, and special offers made for your home.
              </p>
              <p style="margin-top:22px; color:#777777; font-size:13px;">
                Stay tuned. Something beautiful is always arriving at Monsta E-COM.
              </p>
            </div>
            <div style="background:#f1f1f1; padding:14px; text-align:center; color:#777777; font-size:12px;">
              <p style="margin:0 0 8px;">You are receiving this email because you subscribed to Monsta E-COM updates.</p>
              <a href="${unsubscribeUrl}" style="color:#c09578; text-decoration:underline;">Unsubscribe</a>
              <p style="margin:8px 0 0;">&copy; ${new Date().getFullYear()} Monsta E-COM. All rights reserved.</p>
            </div>
          </div>
        </div>
      `,
    });

    await newsletterUseadd.updateOne(
      { _id: subscriber._id },
      { $set: { welcome_sent_at: Date.now(), updated_at: Date.now() } }
    );

    return res.send({
      _status: true,
      _message: "Thank you for subscribing to our newsletter",
      data: subscriber,
    });
  } catch (error) {
    return res.send({
      _status: false,
      _message: "Please enter a valid email address",
      err: buildErrorObject(error),
    });
  }
};

let newsletterUnsubscribe = async (req, res) => {
  try {
    let { email, token } = req.body;
    email = email?.toLowerCase()?.trim();

    if (!emailRegex.test(email || "")) {
      return res.send({
        _status: false,
        _message: "Please enter a valid email address",
      });
    }

    if (!isValidUnsubscribeToken(email, token)) {
      return res.send({
        _status: false,
        _message: "Invalid unsubscribe link",
      });
    }

    let subscriber = await newsletterUseadd.findOne({
      email,
      deleted_at: null,
    });

    if (!subscriber) {
      return res.send({
        _status: false,
        _message: "This email is not subscribed to our newsletter",
      });
    }

    if (!subscriber.status) {
      return res.send({
        _status: true,
        _message: "This email is already unsubscribed",
      });
    }

    subscriber.status = false;
    subscriber.updated_at = Date.now();
    await subscriber.save();

    return res.send({
      _status: true,
      _message: "You have been unsubscribed from our newsletter",
    });
  } catch (error) {
    return res.send({
      _status: false,
      _message: "Newsletter unsubscribe failed",
      err: buildErrorObject(error),
    });
  }
};

let newsletterView = async (req, res) => {
  try {
    let data = await newsletterUseadd
      .find({ deleted_at: null })
      .sort({ created_at: -1 });

    return res.send({
      _status: true,
      _message: "Newsletter Subscribers Viewed",
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

let newsletterDelete = async (req, res) => {
  try {
    let { ids } = req.body;

    let delRes = await newsletterUseadd.updateMany(
      { _id: { $in: ids } },
      { $set: { deleted_at: Date.now(), updated_at: Date.now() } }
    );

    return res.send({
      _status: true,
      _message: "Newsletter Subscriber Deleted",
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

let newsletterChangeStatus = async (req, res) => {
  try {
    let { ids } = req.body;

    await newsletterUseadd.updateMany(
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
      _message: "Newsletter Subscriber Status Changed",
    });
  } catch (error) {
    return res.send({
      _status: false,
      _message: "Something went wrong",
      err: buildErrorObject(error),
    });
  }
};

let newsletterSendMail = async (req, res) => {
  try {
    let { ids, sendToAll, subject, message } = req.body;

    if (!subject || !message) {
      return res.send({
        _status: false,
        _message: "Subject and message are required",
      });
    }

    let filter = {
      deleted_at: null,
      status: true,
    };

    if (!sendToAll) {
      filter._id = { $in: ids || [] };
    }

    let subscribers = await newsletterUseadd.find(filter).select("email");
    let emails = subscribers.map((item) => item.email).filter(Boolean);

    if (emails.length === 0) {
      return res.send({
        _status: false,
        _message: "No active subscribers selected",
      });
    }

    let safeSubject = escapeHtml(subject);
    let safeMessage = escapeHtml(message);

    await Promise.all(
      subscribers.map((subscriber) => {
        let unsubscribeUrl = buildUnsubscribeUrl(subscriber.email);

        return transporter.sendMail({
          from: '"Monsta E-COM" <khushalchoudhary116@gmail.com>',
          to: subscriber.email,
          subject,
          text: `${message}\n\nUnsubscribe: ${unsubscribeUrl}`,
          html: `
        <div style="font-family: Arial, sans-serif; background:#f5f5f5; padding:24px;">
          <div style="max-width:620px; margin:auto; background:#ffffff; border-radius:8px; overflow:hidden; border:1px solid #eeeeee;">
            <div style="background:#c09578; color:#ffffff; padding:22px; text-align:center;">
              <h1 style="margin:0; font-size:24px;">Monsta E-COM</h1>
              <p style="margin:8px 0 0;">${safeSubject}</p>
            </div>
            <div style="padding:28px; color:#333333;">
              <div style="font-size:15px; line-height:1.8; white-space:pre-line;">${safeMessage}</div>
              <p style="margin-top:24px;">Regards,<br/>Monsta E-COM Team</p>
            </div>
            <div style="background:#f1f1f1; padding:14px; text-align:center; color:#777777; font-size:12px;">
              <p style="margin:0 0 8px;">You are receiving this email because you subscribed to Monsta E-COM updates.</p>
              <a href="${unsubscribeUrl}" style="color:#c09578; text-decoration:underline;">Unsubscribe</a>
            </div>
          </div>
        </div>
      `,
        });
      })
    );

    await newsletterUseadd.updateMany(
      { _id: { $in: subscribers.map((item) => new ObjectId(item._id)) } },
      {
        $set: {
          last_mail_subject: subject,
          last_mail_sent_at: Date.now(),
          updated_at: Date.now(),
        },
      }
    );

    return res.send({
      _status: true,
      _message: `Newsletter mail sent to ${emails.length} subscribers`,
    });
  } catch (error) {
    console.log(error);
    return res.send({
      _status: false,
      _message: "Newsletter mail could not be sent",
      err: buildErrorObject(error),
    });
  }
};

module.exports = {
  newsletterSubscribe,
  newsletterUnsubscribe,
  newsletterView,
  newsletterDelete,
  newsletterChangeStatus,
  newsletterSendMail,
};
