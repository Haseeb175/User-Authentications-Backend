const express = require('express');
const { userSignupController, userLoginController, userLogoutController, verifyEmailController } = require('../controllers/authController');

const router = express.Router();
// console.log("Routes Testing");

// User SignUp || POST
router.post("/signup", userSignupController);

// User Verification Email || POST
router.post("/verify-email", verifyEmailController);

// User Login || POST
router.post("/login", userLoginController);

// User Logout || GET
router.get("/logout", userLogoutController);

module.exports = router;