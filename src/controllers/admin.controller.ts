import { NextFunction, Request, Response } from "express";

import { CreateVendorInput } from "../dto/vendor.dto";
import Vendor from "../models/vendor.model";
import { generateSalt, generateHashPassword } from "../utility/passwordUtility";

export const findVendor = async (
  id: string | undefined,
  email?: string,
  phone?: string
) => {
  if (email || phone) {
    return await Vendor.findOne({ $or: [{ email }, { phone }] });
  } else {
    return await Vendor.findById(id);
  }
};

export const createVendor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    name,
    ownerName,
    pincode,
    address,
    phone,
    email,
    password,
    foodType,
  } = <CreateVendorInput>req.body;

  const existVendor = await findVendor("", email, phone);

  if (existVendor)
    return res.status(400).json({
      success: false,
      message: "Vendor Already Exist",
    });

  const salt = generateSalt();
  const hashPassword = generateHashPassword(password, salt);

  const vendor = await Vendor.create({
    name,
    ownerName,
    pincode,
    address,
    phone,
    email,
    foodType,
    password: hashPassword,
    salt,
    rating: 0,
    serviceAvailable: false,
    coverImages: [],
  });

  res.status(201).json({
    success: true,
    vendor,
  });
};

export const getAllVendors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vendors = await Vendor.find();

  res.status(200).json({
    success: true,
    vendors,
  });
};

export const getVendorById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;

  const vendor = await findVendor(id);

  if (!vendor)
    return res.status(400).json({
      success: true,
      message: "Vendor Not Found",
    });

  res.status(200).json({
    success: true,
    vendor,
  });
};
