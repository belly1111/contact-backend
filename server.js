const express = require("express");
const cors = require("cors");
const sgMail = require("@sendgrid/mail");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// ================= ROOT HEALTH CHECK =================
app.get("/", (req, res) => {
  res.status(200).send("API is running 🚀");
});

// ================= CONTACT ROUTE =================
app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  const msg = {
    to: "nabilhaggag2006@gmail.com",
    from: "Nabil Portfolio <nabilhaggag2006@gmail.com>",
    replyTo: email,
    subject: `New Message from ${name} 🚀`,
    html: `
      <h2>New Contact Message</h2>
      <p><b>Name:</b> ${name}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Message:</b> ${message}</p>
    `,
  };

  try {
    await sgMail.send(msg);
    res.json({ success: true });
  } catch (error) {
    console.log(error.response?.body || error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port " + PORT);
});

// safety check
if (!process.env.SENDGRID_API_KEY) {
  console.error("Missing SENDGRID_API_KEY");
}