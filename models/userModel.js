const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    email: {
        type: String,
        required: ["Please Provide User Email", true]
    },
    password: {
        type: String,
        required: ["Please Provide User password", true]
    },
    name: {
        type: String,
        required: ["Please Provide User name", true]
    },
    lastLogin: {
        type: String,
        default: Date.now
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);