const express = require("express");
const cors = require("cors");
const sgMail = require("@sendgrid/mail");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// ================= CHECK SENDGRID KEY =================
if (!process.env.SENDGRID_API_KEY) {
  console.error("Missing SENDGRID_API_KEY");
  process.exit(1);
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// ================= ROOT HEALTH CHECK =================
app.get("/", (req, res) => {
  res.status(200).send("API is running 🚀");
});

// ================= CONTACT ROUTE =================
app.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    console.log("CONTACT HIT:", req.body);
    console.log("HAS SENDGRID KEY:", !!process.env.SENDGRID_API_KEY);

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: "Name, email, and message are required",
      });
    }

    const msg = {
      to: "nabilhaggag2006@gmail.com",

      // لازم الإيميل ده يكون Verified في SendGrid
      from: {
        email: "nabilhaggag2006@gmail.com",
        name: "Nabil Portfolio",
      },

      replyTo: {
        email: email,
        name: name,
      },

      subject: `New Message from ${name}`,

      html: `
        <h2>New Contact Message</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b></p>
        <p>${message}</p>
      `,
    };

    console.log("SENDING TO SENDGRID...");

    await sgMail.send(msg);

    console.log("SENDGRID ACCEPTED");

    res.status(200).json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.log("SENDGRID ERROR:", error.response?.body || error.message || error);

    res.status(500).json({
      success: false,
      error: error.response?.body || error.message || "SendGrid error",
    });
  }
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});