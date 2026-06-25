const nodemailer = require("nodemailer");

let transporter = null;

function isEmailConfigured() {
  return !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function getTransporter() {
  if (!isEmailConfigured()) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587", 10),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return transporter;
}

async function sendEmailAlert(user, { title, body }) {
  if (!user.email || user.notificationChannels?.email === false) return false;
  if (!isEmailConfigured()) {
    console.warn(`[Email] Skipped for ${user.email}: SMTP not configured`);
    return false;
  }

  const transport = getTransporter();
  const from = process.env.EMAIL_FROM || "AlertLanka <alerts@alertlanka.lk>";

  try {
    await transport.sendMail({
      from,
      to: user.email,
      subject: `[AlertLanka] ${title}`,
      text: `${body}\n\n— AlertLanka Disaster Alert System\nEmergency: 1990`,
      html: `
        <div style="font-family:sans-serif;max-width:480px">
          <h2 style="color:#dc2626">${title}</h2>
          <p>${body}</p>
          <hr>
          <p style="color:#666;font-size:12px">
            AlertLanka Disaster Alert System · Sri Lanka<br>
            Real emergency? Call <strong>1990</strong>
          </p>
        </div>
      `,
    });
    return true;
  } catch (err) {
    console.error(`[Email] Failed for ${user.email}:`, err.message);
    return false;
  }
}

module.exports = { sendEmailAlert, isEmailConfigured };
