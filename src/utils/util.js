import crypto from "node:crypto";

export const generateManualCode = (guestId) => {
  const guestPart = guestId.slice(0, 3);
  const randomNo = crypto.randomInt(0, 1_000).toString().padStart(3, "0");

  return `${guestPart}${randomNo}`;
};
