const express = require('express');
const { userSignupController, userLoginController, userLogoutController } = require('../controllers/authController');

const router = express.Router();
// console.log("Routes Testing");

// User SignUp || POST
router.post("/signup", userSignupController);

// User Login ||
router.get("/login", userLoginController);

// User Logout ||
router.get("/logout", userLogoutController);

module.exports = router;