import crypto from "crypto";

export const generateSalt = (length = 16) => {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .slice(0, length);
};

export const generateHashPassword = (password: string, salt: string) => {
  return crypto.createHmac("sha256", salt).update(password).digest("hex");
};
