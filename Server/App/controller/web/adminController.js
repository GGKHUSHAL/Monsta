const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');
const { transporter } = require('../../config/helper');
const adminUseadd = require('../../model/adminModel');

let createadmin = async (req, res) => {
    try {
        let { name, phone_number, email, password } = req.body;

        // email check
        let checkEmail = await adminUseadd.findOne({ email });

        if (checkEmail) {
            return res.send({
                _status: false,
                _message: "Email Already Registered"
            });
        }

        // phone check
        let checkPhone = await adminUseadd.findOne({ phone_number });

        if (checkPhone) {
            return res.send({
                _status: false,
                _message: "Phone Number Already Registered"
            });
        }

        // password hash
        const hash = bcrypt.hashSync(password, saltRounds);

        let insertObj = {
            name,
            phone_number,
            email,
            password: hash
        };

        let user = await adminUseadd.insertOne(insertObj);

        return res.send({
            _status: true,
            _message: "Admin Registered Successfully",
            user
        });

    } catch (error) {
        console.log(error);

        let err = {};

        if (error.errors) {
            for (let key in error.errors) {
                err[key] = error.errors[key].message;
            }
        }

        return res.send({
            _status: false,
            err,
            _message: "Something Went Wrong"
        });
    }
};

let loginadmin = async (req, res) => {
    let { email, password } = req.body
    console.log(email,password)
    try {
        let user = await adminUseadd.findOne({ email: email, deleted_at: null })
        if (!user) {
            return res.send({
                _status: false,
                _message: "Invalid Email or Not registered"
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.send({
                _status: false,
                _message: "Invalid Password"
            });
        }

        let token = jwt.sign({ userId: user._id }, process.env.TOKENKEY)

        let obj = {
            _status: true,
            _message: "Login Successfully",
            token
        }
        res.send(obj)
    } catch (error) {
        console.log(error)
        return res.send({
            _status: false,
            _message: "Internal Server Error"
        });
    }

}

let changePassword = async (req, res) => {

    let { oldPassword, newPassword } = req.body

    let { userId } = req.body
    let userData = await adminUseadd.findOne({ _id: userId, deleted_at: null })
    if (!userData) {
        return res.send({
            _status: false,
            _message: "User Not Found"
        });
    }
    const isMatch = await bcrypt.compare(oldPassword, userData.password);
    if (!isMatch) {
        return res.send({
            _status: false,
            _message: "Invalid Old Password"
        });
    }
    try {

        const hash = bcrypt.hashSync(newPassword, saltRounds);
        await adminUseadd.updateOne({ _id: userId }, { $set: { password: hash } });
        res.send({
            _status: true,
            _message: "Password Changed Successfully"
        });
    } catch (error) {
        console.log(error);
        return res.send({
            _status: false,
            _message: "Internal Server Error"
        });
    }

}

let forgotPassword = async (req, res) => {
    try {
        let { email } = req.body

        let checkUser = await adminUseadd.findOne({ email: email, deleted_at: null })
        if (!checkUser) {
            return res.send({
                _status: false,
                _message: "User Not Registered with this Email"
            });
        }
        if (checkUser) {
            const info = await transporter.sendMail({
                from: '"Monsta E-COM Adminpanel" <khushalchoudhary116@gmail.com>',
                to: checkUser.email,
                subject: "Monsta E-COM Adminpanel - Reset Your Password",
                text: "Reset your password using the link below",
                html: `
  <div style="font-family: Arial, sans-serif; background-color:#f4f4f4; padding:20px;">
    
    <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.1);;">
      
      <div style="background:#4CAF50; color:#fff; padding:20px; text-align:center;">
        <h1 style="margin:0;">Monsta E-COM</h1>
      </div>
      
      <div style="padding:30px; text-align:center;">
        <h2 style="color:#333;">Reset Your Password</h2>
        <p style="color:#666; font-size:15px;">
          We received a request to reset your password. Click the button below to proceed.
        </p>

        <a href="http://localhost:5173/reset-password?userId=${checkUser._id}"
           style="display:inline-block; margin-top:20px; padding:12px 25px; background:#4CAF50; color:#fff; text-decoration:none; border-radius:5px; font-weight:bold;">
           Reset Password
        </a>

        <p style="margin-top:25px; font-size:13px; color:#999;">
          If you didn’t request this, you can safely ignore this email.
        </p>
      </div>

      <div style="background:#f1f1f1; padding:15px; text-align:center; font-size:12px; color:#777;">
        © ${new Date().getFullYear()} Monsta E-COM. All rights reserved.
      </div>

    </div>

  </div>
  `,
            }); // HTML body

            let obj = {
                _status: true,
                _message: "Reset Password Link Sent to Your Email",
                info
            }
            res.send(obj)

        }
    } catch (error) {
        console.log(error);
        return res.send({
            _status: false,
            _message: "Internal Server Error"
        });
    }
}

let resetPassword = async (req, res) => {
    try {
        let { userId, new_password } = req.body;

        // 🔍 Validation
        if (!userId || !new_password) {
            return res.send({
                _status: false,
                _message: "User ID and New Password are required",
            });
        }

        // 🔍 Check user by ID
        let checkUser = await adminUseadd.findOne({
            _id: userId,
            deleted_at: null,
        });

        if (!checkUser) {
            return res.send({
                _status: false,
                _message: "User not found",
            });
        }

        // 🔐 Hash password (async)
        const saltRounds = 10;
        const hash = await bcrypt.hash(new_password, saltRounds);

        // 🔄 Update password
        await adminUseadd.updateOne(
            { _id: checkUser._id },
            { $set: { password: hash } }
        );

        return res.send({
            _status: true,
            _message: "Password Reset Successfully",
        });

    } catch (error) {
        console.log(error);
        return res.send({
            _status: false,
            _message: "Internal Server Error",
        });
    }
};

let getAdminData = async (req, res) => {
    let { userId } = req.body
    let userData = await adminUseadd.findOne({ _id: userId, deleted_at: null })
    let obj = {
        _status: true,
        _message: "User Data Fetched Successfully",
        path: process.env.ADMINPROFILEPATH,
        userData
    }
    res.send(obj)
}

let getAdminDataList = async (req, res) => {
    let userData = await adminUseadd.find({ deleted_at: null })
    let obj = {
        _status: true,
        _message: "User Data Fetched Successfully",
        path: process.env.ADMINPROFILEPATH,
        userData
    }
    res.send(obj)
}

let deleteAdmin = async (req, res) => {
    try {
        let { ids } = req.body;

        if (!ids || !Array.isArray(ids)) {
            return res.send({
                _status: false,
                _message: "Invalid IDs provided"
            });
        }

        let admins = await adminUseadd.find({
            _id: { $in: ids }
        });

        let hasSuperAdmin = admins.some(item => item.role === "super_admin");

        if (hasSuperAdmin) {
            return res.send({
                _status: false,
                _message: "Super Admin cannot be deleted"
            });
        }

        let deletedAdmins = await adminUseadd.updateMany(
            { _id: { $in: ids } },
            { $set: { deleted_at: new Date() } }
        );

        return res.send({
            _status: true,
            _message: "Admin Deleted Successfully",
            deletedAdmins
        });

    } catch (error) {
        console.log(error);
        return res.send({
            _status: false,
            _message: "Internal Server Error"
        });
    }
};

let updateProfile = async (req, res) => {
    try {
        let { userId } = req.body;

        // check user
        let userData = await adminUseadd.findOne({
            _id: userId,
            deleted_at: null
        });

        if (!userData) {
            return res.send({
                _status: false,
                _message: "User Not Found"
            });
        }

        // body data
        let {
            name,
            email,
            gender,
            phone_number,

            company_name,
            company_email,
            company_phone_number,
            company_address,
            company_map_location,
            company_facebook_link,
            company_instagram_link,
            company_twitter_link,
            company_youtube_link,
            company_linkedin_link,
            company_telegram_link
        } = req.body;

        // update object
        let updateObj = {
            updated_at: new Date()
        };

        // =========================
        // NORMAL PROFILE FIELDS
        // =========================
        if (name !== undefined) updateObj.name = name;
        if (email !== undefined) updateObj.email = email;
        if (gender !== undefined) updateObj.gender = gender;
        if (phone_number !== undefined) updateObj.phone_number = phone_number;

        // =========================
        // COMPANY PROFILE FIELDS
        // =========================
        if (company_name !== undefined) updateObj.company_name = company_name;
        if (company_email !== undefined) updateObj.company_email = company_email;
        if (company_phone_number !== undefined) updateObj.company_phone_number = company_phone_number;
        if (company_address !== undefined) updateObj.company_address = company_address;
        if (company_map_location !== undefined) updateObj.company_map_location = company_map_location;
        if (company_facebook_link !== undefined) updateObj.company_facebook_link = company_facebook_link;
        if (company_instagram_link !== undefined) updateObj.company_instagram_link = company_instagram_link;
        if (company_twitter_link !== undefined) updateObj.company_twitter_link = company_twitter_link;
        if (company_youtube_link !== undefined) updateObj.company_youtube_link = company_youtube_link;
        if (company_linkedin_link !== undefined) updateObj.company_linkedin_link = company_linkedin_link;
        if (company_telegram_link !== undefined) updateObj.company_telegram_link = company_telegram_link;

        // =========================
        // IMAGE HANDLING
        // =========================

        // single image route support
        if (req.file) {
            if (req.file.fieldname === "profileImage") {
                updateObj.profileImage = req.file.filename;
            }

            if (req.file.fieldname === "company_logo") {
                updateObj.company_logo = req.file.filename;
            }
        }

        // multiple image route support
        if (req.files) {
            if (req.files.profileImage && req.files.profileImage[0]) {
                updateObj.profileImage =
                    req.files.profileImage[0].filename;
            }

            if (req.files.company_logo && req.files.company_logo[0]) {
                updateObj.company_logo =
                    req.files.company_logo[0].filename;
            }
        }

        // update data
        let userUpdated = await adminUseadd.updateOne(
            { _id: userId },
            { $set: updateObj }
        );

        return res.send({
            _status: true,
            _message: "Profile Updated Successfully",
            userUpdated
        });

    } catch (error) {
        console.log(error);

        let err = {};

        if (error.errors) {
            for (let key in error.errors) {
                err[key] = error.errors[key].message;
            }
        }

        return res.send({
            _status: false,
            _message: "Something went wrong",
            err
        });
    }
};

module.exports = { createadmin, loginadmin, changePassword, forgotPassword, resetPassword, getAdminData, deleteAdmin, getAdminDataList, updateProfile }
