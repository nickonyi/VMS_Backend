import { transporter } from "../config/mail.js";
import "dotenv/config";

export const sendVisitorCodeEmail = async ({
  email,
  guestName,
  manualCode,
  visitDate,
  arrivalTime,
  expiryTime,
}) => {
  const mailOptions = {
    from: process.env.MAIL_FROM,
    to: email,
    subject: "Your Visitor Pass Code",
    text: `
Hello ${guestName},

A visitor pass has been created for you.

Your visitor access code is:

${manualCode}

Visit details:
Date: ${visitDate}
Expected arrival: ${arrivalTime}
Expires: ${expiryTime}

Please provide this code to the security guard when you arrive.

If you did not expect this visitor pass, please contact the resident who created it.
    `.trim(),
  };

  return transporter.sendMail(mailOptions);
};

try {
  const info = await sendVisitorCodeEmail({
    email: "nick@sledgegroup.co.ke",
    guestName: "John Doe",
    manualCode: "042817",
    visitDate: "2026-08-10",
    arrivalTime: "10:00",
    expiryTime: "14:00",
  });

  console.log("Email sent:", info.messageId);
} catch (error) {
  console.error("Failed to send email:", error);
}
