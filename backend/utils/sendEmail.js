import nodemailer from "nodemailer";

function getTransporter() {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  if (!user || !pass) {
    return null;
  }
  return nodemailer.createTransport({
    secure: false,
    service: "gmail",
    auth: { user, pass },
  });
}

export const sendEmail = async ({ to, subject, html }) => {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn("[Email] Skipped – EMAIL_USER or EMAIL_PASS not set in .env");
    return;
  }
  await transporter.sendMail({
    from: `"HireHub" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};
