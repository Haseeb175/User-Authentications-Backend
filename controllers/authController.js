const { token } = require("morgan");
const userModel = require("../models/userModel");
const bcrypt = require('bcryptjs');
const generateTokenAndSetCookie = require("../utils/generateTokenAndSetCookie");

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

        res.status(201).json({
            success: true,
            message: "User Created Successfully",
            user: {
                ...user._doc,
                password: undefined
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


// User Signup Controller
const userLoginController = async (req, res) => {

};


// User Signup Controller
const userLogoutController = async (req, res) => {

};


module.exports = { userSignupController, userLoginController, userLogoutController };
