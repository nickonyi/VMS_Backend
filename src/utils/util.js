import crypto from "node:crypto";

export const generateManualCode = () => {
  return crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");
};
