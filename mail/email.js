const { VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE } = require("./emailTemplate");
const { transport, sender } = require("./mailtrap");

// Verification Email
const sendVerificationEmail = async (email, verificationToken) => {
    //const recipient = [{ email }];
    try {
        const response = await transport.sendMail({
            to: email,
            from: sender,
            subject: "Verify your Email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email Verification"
        });
        console.log("Email Send Successfully", response);
    } catch (error) {
        console.log("Error Email Verification", error);
        res.status(500).json({
            success: true,
            message: "Error in Email Verification",
            error
        });
    }
}

// Welcome Email
const sendWelcomeEmail = async (email, name) => {
    try {
        const response = await transport.sendMail({
            to: email,
            from: sender,
            templateUuid: "eebcd724-b246-495a-bb65-e09c3496382c",
            templateVariables: {
                "company_info_name": "Haseeb User Authentication Project",
                "name": name
            }
        });
        console.log("Email Send Successfully", response);
    } catch (error) {
        console.log("Error in Welcome Email", error);
        res.status(500).json({
            success: true,
            message: "Error in Welcome Email",
            error
        });
    }
}

// Reset Password Email
const sendPasswordResetEmail = async (email, resetUrl) => {

    try {
        const response = await transport.sendMail({
            to: email,
            from: sender,
            subject: "Reset Your Password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetUrl),
            category: "Reset Password"
        });
        console.log(" Reset Password Email Send Successfully", response);
    } catch (error) {
        console.log("Error in Reset Password Email", error);
        res.status(500).json({
            success: true,
            message: "Error in Reset Password Email",
            error
        });
    }
}

// Update Password Email
const sendResetSuccessEmail = async (email) => {
    try {

        const response = await transport.sendMail({
            to: email,
            from: sender,
            subject: "Update Password Successfully",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Update Password"
        });
        console.log(" Update Password Email Send Successfully", response);

    } catch (error) {
        console.log("Error in Update Password Email ", error);
        res.status(500).json({
            success: true,
            message: "Error in Update Password Email",
            error
        });
    }
}

module.exports = { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendResetSuccessEmail };