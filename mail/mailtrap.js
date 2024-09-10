const Nodemailer = require("nodemailer");
const dotenv = require('dotenv');
const { MailtrapTransport } = require("mailtrap");

dotenv.config({ path: './config/.env' });

const TOKEN = process.env.MAILTRAP_TOKEN;
const transport = Nodemailer.createTransport(
    MailtrapTransport({
        token: TOKEN,
    })
);

const sender = {
    address: "mailtrap@demomailtrap.com",
    name: "Haseeb Ahmed",
};
const recipients = [
    "mrhaseeb200@gmail.com",
];

transport
    .sendMail({
        from: sender,
        to: recipients,
        subject: "You are awesome!",
        text: "Congrats for sending test email with Mailtrap!",
        category: "Integration Test",
    })
    .then(console.log, console.error);