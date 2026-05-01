const bcrypt = require('bcrypt');
const userUseadd = require('../../model/userModel');
const saltRounds = 10;
var jwt = require('jsonwebtoken');
const { transporter } = require('../../config/helper');

let createuser = async (req, res) => {
    let { name, phone_number, email, password } = req.body

    try {

        const hash = bcrypt.hashSync(password, saltRounds);
        let insertObj = {
            name,
            phone_number,
            email,
            password: hash
        }

        user = await userUseadd.insertOne(insertObj)

        let obj = {
            _status: true,
            _message: "User Registered Successfully",
            user
        }
        res.send(obj)

    }
    catch (error) {
        console.log(error)
        let err = {}
        for (let key in error.errors) {
            err[key] = error.errors[key].message
        }
        return res.send({
            _status: false,
            err
        });
    }

}

let loginuser = async (req, res) => {
    let { email, password } = req.body
    try {
        let user = await userUseadd.findOne({ email: email, deleted_at: null })
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
    let userData = await userUseadd.findOne({ _id: userId, deleted_at: null })
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
        await userUseadd.updateOne({ _id: userId }, { $set: { password: hash } });
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

        let checkUser = await userUseadd.findOne({ email: email, deleted_at: null })
        if (!checkUser) {
            return res.send({
                _status: false,
                _message: "User Not Registered with this Email"
            });
        }
        if (checkUser) {
            const info = await transporter.sendMail({
                from: '"Monsta E-COM" <khushalchoudhary116@gmail.com>',
                to: checkUser.email,
                subject: "Monsta E-COM - Reset Your Password",
                text: "Reset your password using the link below",
                html: `
  <div style="font-family: Arial, sans-serif; background-color:#f4f4f4; padding:20px;">
    
    <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.1);">
      
      <div style="background:#4CAF50; color:#fff; padding:20px; text-align:center;">
        <h1 style="margin:0;">Monsta E-COM</h1>
      </div>
      
      <div style="padding:30px; text-align:center;">
        <h2 style="color:#333;">Reset Your Password</h2>
        <p style="color:#666; font-size:15px;">
          We received a request to reset your password. Click the button below to proceed.
        </p>

        <a href="http://localhost:3000/reset-password?userId=${checkUser._id}"
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
        let checkUser = await userUseadd.findOne({
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
        await userUseadd.updateOne(
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

let getUserData = async (req, res) => {
    let { userId } = req.body
    let userData = await userUseadd.findOne({ _id: userId, deleted_at: null })
    let obj = {
        _status: true,
        _message: "User Data Fetched Successfully",
        path: process.env.PROFILEPATH,
        userData
    }
    res.send(obj)
}

let updateProfile = async (req, res) => {
    try {
        // 🔐 Token decode
        let { userId } = req.body;

        // 📦 Get body data
        let { name, email, address, gender } = req.body;

        // 👤 Find user
        let userData = await userUseadd.findOne({
            _id: userId,
            deleted_at: null
        });

        if (!userData) {
            return res.send({
                _status: false,
                _message: "User Not Found"
            });
        }

        // 🧾 Prepare update object
        let updateObj = {
            updated_at: new Date()
        };

        if (name !== undefined) updateObj.name = name;
        if (email !== undefined) updateObj.email = email;
        if (address !== undefined) updateObj.address = address;
        if (gender !== undefined) updateObj.gender = gender;

        // 🖼️ Image upload handling (same like category)
        if (req.file) {
            if (req.file.filename) {
                updateObj["profileImage"] = req.file.filename;
            }
        }

        // 🔄 Update user
        let userUpdated = await userUseadd.updateOne(
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

let updateAddresses = async (req, res) => {
    try {
        let { userId } = req.body;

        let userData = await userUseadd.findOne({
            _id: userId,
            deleted_at: null
        });

        if (!userData) {
            return res.send({
                _status: false,
                _message: "User Not Found"
            });
        }

        let { billingAddress, shippingAddress } = req.body;

        let updateObj = {
            updated_at: new Date()
        };

        if (billingAddress !== undefined) {
            updateObj.billingAddress = billingAddress;
        }

        if (shippingAddress !== undefined) {
            updateObj.shippingAddress = shippingAddress;
        }

        let updateRes = await userUseadd.updateOne(
            { _id: userId },
            { $set: updateObj }
        );

        return res.send({
            _status: true,
            _message: "Address Updated Successfully",
            updateRes
        });
    } catch (error) {
        console.log(error);

        return res.send({
            _status: false,
            _message: "Something went wrong"
        });
    }
};

module.exports = { createuser, loginuser, changePassword, forgotPassword, resetPassword, getUserData, updateProfile, updateAddresses }
