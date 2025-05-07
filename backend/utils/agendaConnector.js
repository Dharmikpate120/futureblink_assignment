const Agenda = require("agenda");
const agenda = new Agenda({ db: { address: process.env.MONGODB_URI } });
const nodemailer = require("nodemailer");
require("dotenv").config();
const SENDER_EMAIL = process.env.SENDER_EMAIL;
const SENDER_EMAIL_PASSWORD = process.env.SENDER_EMAIL_PASSWORD;

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: SENDER_EMAIL,
    pass: SENDER_EMAIL_PASSWORD,
  },
});

agenda.define("send email", async (job) => {
  const {
    leads,
    emailFormat: { header, body },
  } = job.attrs.data;
  leads.map((lead) => {
    const mailOptions = {
      from: SENDER_EMAIL,
      to: lead.email,
      subject: header,
      text: body,
      html: "<p>Hello!</p><p>This is a <b>test email</b> sent using Nodemailer.</p>",
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });
    // console.log(lead.email, "email:", header, body);
  });
});

agenda.on("ready", async () => {
  await agenda.start();
});
module.exports = agenda;
