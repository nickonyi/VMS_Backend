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
