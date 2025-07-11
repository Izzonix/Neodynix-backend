
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const resend = new Resend(process.env.RESEND_API_KEY);

app.post("/send-email", async (req, res) => {
  const { name, email, category, template, details, followup_link } = req.body;

  try {
    // Send email to client
    await resend.emails.send({
      from: "Neodynix <onboarding@resend.dev>",
      to: email,
      subject: "Your Website Request – Neodynix",
      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2 style="color: #4fc3f7;">Hi ${name},</h2>
          <p>Thank you for requesting a website from <strong>Neodynix Technologies</strong>.</p>
          <ul>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Category:</strong> ${category}</li>
            <li><strong>Template:</strong> ${template}</li>
            <li><strong>Details:</strong> ${details || "None"}</li>
          </ul>
          <p>
            <a href="${followup_link}" style="background: #4fc3f7; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none;">Customize My Website</a>
          </p>
        </div>
      `
    });

    // Send to admin
    await resend.emails.send({
      from: "Neodynix <onboarding@resend.dev>",
      to: "isaacsemwogerere37@gmail.com",
      subject: "New Website Request",
      text: `New request received:
Name: ${name}
Email: ${email}
Category: ${category}
Template: ${template}
Details: ${details}
Follow-up Link: ${followup_link}`
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to send emails" });
  }
});

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
