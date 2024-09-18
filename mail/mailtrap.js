const Nodemailer = require("nodemailer");
const dotenv = require('dotenv');
const { MailtrapTransport } = require("mailtrap");

dotenv.config({ path: './config/.env' });


const transport = Nodemailer.createTransport(
    MailtrapTransport({
        token: process.env.MAILTRAP_TOKEN,
    })
);

const sender = {
    address: "mailtrap@demomailtrap.com",
    name: "Haseeb Ahmed",
};


// //  test mailtrap
// const recipients = [
//     "mrhaseeb200@gmail.com",
// ];

// transport
//     .sendMail({
//         from: sender,
//         to: recipients,
//         subject: "You are awesome!",
//         html: "Congrats for sending test email with Mailtrap!",
//         category: "Integration Test",
//     })
//     .then(console.log, console.error);

module.exports = { transport, sender };