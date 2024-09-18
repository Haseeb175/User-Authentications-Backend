const express = require('express');
const { userSignupController, userLoginController, userLogoutController, verifyEmailController } = require('../controllers/authController');

const router = express.Router();
// console.log("Routes Testing");

// User SignUp || POST
router.post("/signup", userSignupController);

// User Verification Email || POST
router.post("/verify-email", verifyEmailController);

// User Login ||
router.get("/login", userLoginController);

// User Logout ||
router.get("/logout", userLogoutController);

module.exports = router;