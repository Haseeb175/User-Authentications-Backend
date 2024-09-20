const express = require('express');

const { userSignupController, userLoginController, userLogoutController, verifyEmailController, userForgetPasswordController, userResetPasswordController, userCheckAuthController } = require('../controllers/authController');

const verifyAuth = require('../middlewares/verifyAuth');

const router = express.Router();
// console.log("Routes Testing");

// Check User || GET
router.get("/check-auth", verifyAuth, userCheckAuthController);

// User SignUp || POST
router.post("/signup", userSignupController);

// User Verification Email || POST
router.post("/verify-email", verifyEmailController);

// User Login || POST
router.post("/login", userLoginController);

// User Forget Password || POST
router.post("/forget-password", userForgetPasswordController);

// User Reset Password || POST
router.post("/reset-password/:token", userResetPasswordController);

// User Logout || GET
router.get("/logout", userLogoutController);

module.exports = router;