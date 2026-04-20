const nodemailer = require("nodemailer");
const isMailConfigured = Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS);

const transporter = isMailConfigured
  ? nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })
  : null;

if (transporter) {
  transporter.verify((error) => {
    if (error) {
      console.error("Email transporter verification failed:", error.message || error);
      return;
    }
    console.log("Email transporter is ready.");
  });
} else {
  console.warn("Email service is disabled: EMAIL_USER or EMAIL_PASS is missing.");
}

async function sendMail(to, subject, text, html) {
  if (!transporter) {
    throw new Error("Email service is not configured.");
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    html,
  };

  return transporter.sendMail(mailOptions);
}

module.exports = {
  sendMail,
  isMailConfigured,
};