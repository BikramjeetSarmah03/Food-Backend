import crypto from "crypto";
import jwt from "jsonwebtoken";

import { AuthPayload } from "../dto";
import { JWT_SECRET } from "../config";
import { Request } from "express";

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

export const generateSignature = (payload: AuthPayload) => {
  return jwt.sign(payload, JWT_SECRET || "", {
    expiresIn: "1d",
  });
};

export const validateSignature = async (req: Request) => {
  const signature = req.get("Authorization");

  if (!signature) return false;

  const payload = (await jwt.verify(
    signature.split(" ")[1],
    JWT_SECRET
  )) as AuthPayload;

  if (!payload) return false;

  req.user = payload;

  return true;
};
