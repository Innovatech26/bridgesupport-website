# Bridge Support Website


require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");



const app = express();


app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://172.20.141.216:3000", // ✅ ADD THIS
    "https://innovatech26.github.io/bridgesupport-website"
  ],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}))



app.use(express.json());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post("/contact", async (req, res) => {
  const { first_name, last_name, email, service, message } = req.body;

  console.log("Incoming form data:", req.body);
  console.log("EMAIL USER:", process.env.EMAIL_USER);
  console.log("EMAIL PASS:", process.env.EMAIL_PASS);

  try {
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
    console.error("EMAIL ERROR:", error);
    res.status(500).json({ success: false });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
