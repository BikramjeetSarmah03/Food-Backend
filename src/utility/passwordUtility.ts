import crypto from "crypto";

export const generateSalt = async (length = 16) => {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .slice(0, length);
};

export const generateHashPassword = async (password: string, salt: string) => {
  return crypto.createHmac("sha256", salt).update(password).digest("hex");
};

export const validatePassword = async (
  enteredPassword: string,
  savedPassword: string,
  salt: string
) => {
  return (await generateHashPassword(enteredPassword, salt)) === savedPassword;
};
