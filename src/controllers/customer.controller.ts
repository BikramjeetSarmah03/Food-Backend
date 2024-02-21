import { NextFunction, Request, Response } from "express";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";

import { CreateCustomerInputs } from "../dto";
import {
  generateHashPassword,
  generateSalt,
  generateSignature,
} from "../utility/passwordUtility";
import Customer from "../models/customer.model";
import { generateOtp, onRequestOtp } from "../utility/notificationUtility";

export const customerSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customerInputs = plainToClass(CreateCustomerInputs, req.body);

  const inputErrors = await validate(customerInputs, {
    validationError: {
      target: true,
    },
  });

  if (inputErrors.length > 0) {
    return res.status(400).json({
      success: false,
      errors: inputErrors,
    });
  }

  const { email, phone, password } = customerInputs;

  const salt = await generateSalt();
  const hashPassword = await generateHashPassword(password, salt);

  const { otp, expiry } = generateOtp();

  const customer = await Customer.create({
    email,
    phone,
    password: hashPassword,
    salt,
    firstName: "",
    lastName: "",
    otp: otp,
    otp_expiry: expiry,
    address: "",
    verified: false,
    lat: 0,
    lng: 0,
  });

  // send otp to customer
  await onRequestOtp(otp, phone);

  // generate signature
  const signature = generateSignature({
    _id: customer._id,
    email: customer.email,
    verified: customer.verified,
  });

  // send result to client

  return res.status(201).json({
    success: true,
    signature,
    email: customer.email,
    verified: customer.verified,
  });
};

export const customerLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const customerVerify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const requestOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const getCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const updateCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
