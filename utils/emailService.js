import nodemailer from "nodemailer";

export default async function sendMail(email, subject, html) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    html,
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.log(err);
  }
}
