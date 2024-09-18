const userModel = require("../models/userModel");
const bcrypt = require('bcryptjs');
const generateTokenAndSetCookie = require("../utils/generateTokenAndSetCookie");
const { sendVerificationEmail, sendWelcomeEmail } = require("../mail/email");

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

};

// User Signup Controller
const userLogoutController = async (req, res) => {

};


module.exports = { userSignupController, verifyEmailController, userLoginController, userLogoutController };
