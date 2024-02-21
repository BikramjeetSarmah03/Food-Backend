import { NextFunction, Request, Response } from "express";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";

import {
  CreateCustomerInputs,
  CustomerLoginInputs,
  UpdateCustomerProfile,
} from "../dto";
import {
  generateHashPassword,
  generateSalt,
  generateSignature,
  validatePassword,
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

  const customerExist = await Customer.findOne({ $or: [{ email }, { phone }] });

  if (customerExist)
    return res.status(400).json({
      success: false,
      message: "Customer already exist with the email and phone",
    });

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
) => {
  const loginInputs = plainToClass(CustomerLoginInputs, req.body);

  const loginErrors = await validate(loginInputs, {
    validationError: {
      target: false,
    },
  });

  if (loginErrors.length > 0)
    return res.status(400).json({
      success: false,
      errors: loginErrors,
    });

  const { email, password } = req.body;

  const customer = await Customer.findOne({ email });

  if (!customer)
    return res.status(404).json({
      success: false,
      message: "Customer not found",
    });

  const comparePassword = await validatePassword(
    password,
    customer.password,
    customer.salt
  );

  if (!comparePassword)
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });

  const signature = generateSignature({
    _id: customer._id,
    email: customer.email,
    verified: customer.verified,
  });

  return res.status(200).json({
    success: true,
    customer,
  });
};

export const customerVerify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { otp } = req.body;
  const customer = req.user;

  if (!customer)
    return res.status(400).json({
      success: false,
      message: "Customer not logged in",
    });

  const profile = await Customer.findById(customer._id);

  if (!profile)
    return res.status(404).json({
      success: false,
      message: "Customer profile not found",
    });

  if (!(profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()))
    return res.status(401).json({
      success: false,
      message: "Invalid OTP",
    });

  profile.verified = true;

  const updatedCustomerReponse = await profile.save();

  const signature = generateSignature({
    _id: updatedCustomerReponse._id,
    email: updatedCustomerReponse.email,
    verified: updatedCustomerReponse.verified,
  });

  return res.status(200).json({
    success: true,
    signature,
    email: updatedCustomerReponse.email,
    verified: updatedCustomerReponse.verified,
  });
};

export const requestOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const getCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;

  if (!customer)
    return res.status(400).json({
      success: false,
      message: "Customer not logged in",
    });

  const profile = await Customer.findById(customer._id);

  if (!profile)
    return res.status(404).json({
      success: false,
      message: "Customer profile not found",
    });

  res.status(200).json({
    success: true,
    profile,
  });
};

export const updateCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;

  if (!customer)
    return res.status(400).json({
      success: false,
      message: "Customer not logged in",
    });

  const profile = await Customer.findById(customer._id);

  if (!profile)
    return res.status(404).json({
      success: false,
      message: "Customer profile not found",
    });

  const profileInputs = plainToClass(UpdateCustomerProfile, req.body);

  const profileErrors = await validate(profileInputs, {
    validationError: { target: false },
  });

  if (profileErrors.length > 0)
    return res.status(400).json({
      success: false,
      errors: profileErrors,
    });

  const { firstName, lastName, address } = profileInputs;

  profile.firstName = firstName;
  profile.lastName = lastName;
  profile.address = address;

  await profile.save();

  return res.status(200).json({
    success: true,
    profile,
  });
};
