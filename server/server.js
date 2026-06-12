require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

console.log(process.env.EMAIL_USER);
console.log(process.env.EMAIL_PASS);

app.use(cors());
app.use(express.json());

// ✅ Mail transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Route
app.post("/contact", async (req, res) => {
  const { first_name, last_name, email, service, message } = req.body;

  try {
    // 1️⃣ Send email to company
    await transporter.sendMail({
      from: `"Website Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "New Inquiry from Website",
      html: `
        <h3>New Inquiry</h3>
        <p><strong>Name:</strong> ${first_name} ${last_name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `,
    });

    // 2️⃣ Auto-reply to client
    await transporter.sendMail({
      from: `"BridgeSupport" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "We received your inquiry",
      html: `
        <p>Hello ${first_name},</p>

        <p>Thank you for contacting <strong>BridgeSupport Limited</strong>.</p>

        <p>We have received your inquiry regarding <strong>${service}</strong>.</p>

        <p>Our team will get back to you shortly.</p>

        <br/>
        <p>Best regards,<br/>BridgeSupport Team</p>
      `,
    });

    res.status(200).json({ success: true });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
