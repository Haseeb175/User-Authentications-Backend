const { VERIFICATION_EMAIL_TEMPLATE } = require("./emailTemplate");
const { transport, sender } = require("./mailtrap");


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
        process.exit(1);
    }
}

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
        console.log("Error Email Verification", error);
        process.exit(1);
    }
}

module.exports = { sendVerificationEmail, sendWelcomeEmail };