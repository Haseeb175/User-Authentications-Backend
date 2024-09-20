const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userModel = require("../models/userModel");

const generateTokenAndSetCookie = require("../utils/generateTokenAndSetCookie");
const { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendResetSuccessEmail } = require("../mail/email");

// User Signup Controller
const userSignupController = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        // Check Field Validation
        if (!email || !password || !name) {
            return res.status(400).json({
                success: false,
                message: "Please provide All Fields"
            })
        };

        // Check User Existing Validation
        const userExisting = await userModel.findOne({ email });
        if (userExisting) {
            return res.status(400).json({
                success: false,
                message: "User Already Registered"
            });
        }

        // Hash Password
        const hashPassword = await bcrypt.hash(password, 10);

        // Verification Token
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        // User data Schema
        const user = new userModel({
            email,
            password: hashPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 days
        });

        // save User Data in Collection
        await user.save();

        // JsonWebToken
        generateTokenAndSetCookie(res, user._id);

        // send message to email
        await sendVerificationEmail(user.email, verificationToken);

        res.status(201).json({
            success: true,
            message: "User Created Successfully",
            user: {
                ...user._doc,
                password: undefined,
                // verificationToken: undefined
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error in Signup Api",
            error
        })
    }
};

// User verify Email Controller
const verifyEmailController = async (req, res) => {
    const { code } = req.body;
    try {

        // check user by verification token number
        const user = await userModel.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() }
        })

        // validation of user
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or Expired Verification Code"
            })
        }

        user.isVerified = true;                        // change isverified status
        user.verificationToken = undefined;            // hide verification token
        user.verificationTokenExpiresAt = undefined;   // hide verification token expire at

        // save user data in database
        await user.save();

        // send welcome email by user after verify successfully
        await sendWelcomeEmail(user.email, user.name);

        res.status(200).json({
            success: true,
            message: "Verify Email Successfully",
            user: {
                ...user._doc,
                password: undefined
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error in verify Email Api",
            error
        })
    }
};

// User Signup Controller
const userLoginController = async (req, res) => {

    const { email, password } = req.body;

    try {
        // check email of user
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid Credentials"
            });
        }
        // campare password to database 
        const isPassword = await bcrypt.compare(password, user.password);
        if (!isPassword) {
            return res.status(400).json({
                success: false,
                message: "Invalid Credentials"
            });
        }
        generateTokenAndSetCookie(res, user._id);
        user.lastLogin = new Date();
        await user.save();

        res.status(200).json({
            success: true,
            message: "User login Successfully",
            user: {
                ...user._doc,
                password: undefined,
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: " Error in Login API",
            error
        })
    }
};

// User Forget Password Controller 
const userForgetPasswordController = async (req, res) => {

    const { email } = req.body;

    try {
        // check email of user
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not Found"
            });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;

        await user.save();

        // Send Reset Password Email
        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`)
        res.status(200).json({
            success: true,
            message: "Reset Password Link sent to Email"
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: " Error in Forget Password API",
            error
        })
    }
}

// User Reset Password Controller
const userResetPasswordController = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    try {
        // find user by token
        const user = await userModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() }
        });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or Expires reset token"
            });
        }

        // update password
        const hashPassword = await bcrypt.hash(password, 10);

        user.password = hashPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined

        await user.save();

        await sendResetSuccessEmail(user.email);

        res.status(200).json({
            success: true,
            message: "User Reset Password Successfully"
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: " Error in Reset Password API",
            error
        })
    }
}

// Check User Auth Controller
const userCheckAuthController = async (req, res) => {
    try {
        const user = await userModel.findById(req.userID).select("-password");
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "No User Found",
            })
        }
        res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        console.log("Error in Check Auth API");
        res.status(500).json({
            success: false,
            message: "Error in Check Auth API",
            error
        })
    }
}

// User Signup Controller
const userLogoutController = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({
        success: true,
        message: `User Logout Successfully`
    });
};

module.exports = { userSignupController, verifyEmailController, userLoginController, userForgetPasswordController, userResetPasswordController, userCheckAuthController, userLogoutController };
