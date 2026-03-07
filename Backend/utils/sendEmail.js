import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",    // Hardcode this to avoid DNS confusion
    port: 465,                 // Standard SSL port
    secure: true,              // Use SSL
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
    // 🌟 THE MAGIC FIX: Force Node to use IPv4 instead of IPv6!
    family: 4, 
  });

  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: options.email,
    subject: options.subject,
    html: options.message, 
  };

  await transporter.sendMail(mailOptions);
};