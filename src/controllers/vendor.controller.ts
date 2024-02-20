import { NextFunction, Request, Response } from "express";

import { CreateFoodInputs, EditVendorInput, VendorLoginInput } from "../dto";
import { findVendor } from "./admin.controller";
import {
  generateSignature,
  validatePassword,
} from "../utility/passwordUtility";
import Food from "../models/food.model";

export const vendorLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = <VendorLoginInput>req.body;

  const vendor = await findVendor("", email);

  if (!vendor)
    return res.status(404).json({
      success: false,
      message: "Vendor Not Found",
    });

  const passwordMatch = await validatePassword(
    password,
    vendor.password,
    vendor.salt
  );

  if (!passwordMatch)
    return res.status(401).json({
      success: false,
      message: "Invalid Credentials",
    });

  const signature = generateSignature({
    _id: vendor._id,
    email: vendor.email,
    foodTypes: vendor.foodType,
    name: vendor.name,
  });

  res.status(200).json({
    success: true,
    vendor,
    signature,
  });
};

export const getVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (!user)
    return res.status(404).json({
      success: false,
      message: "Vendor not found",
    });

  const vendor = await findVendor(user._id);

  return res.status(200).json({
    success: true,
    message: "Vendor Found",
    vendor,
  });
};

export const updateVendorCoverImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (!user)
    return res.status(404).json({
      success: false,
      message: "Vendor not found",
    });

  const vendor = await findVendor(user._id);

  if (!vendor)
    return res.status(404).json({
      success: false,
      message: "Vendor not found",
    });

  const files = req.files as [Express.Multer.File];

  const images = files.map((file: Express.Multer.File) => file.filename);

  vendor.coverImages.push(...images);

  const result = await vendor.save();

  return res.status(201).json({
    success: true,
    message: "Vendor cover image updated",
    vendor: result,
  });
};

export const updateVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, address, phone, foodTypes } = <EditVendorInput>req.body;
  const user = req.user;

  if (!user)
    return res.status(404).json({
      success: false,
      message: "Vendor not found",
    });

  const vendor = await findVendor(user._id);

  if (!vendor)
    return res.status(404).json({
      success: false,
      message: "Vendor not found",
    });

  vendor.name = name;
  vendor.phone = phone;
  vendor.address = address;
  vendor.foodType = foodTypes;

  await vendor.save();

  return res.status(200).json({
    success: true,
    message: "Vendor Profile Updated",
    vendor,
  });
};

export const updateVendorService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (!user)
    return res.status(404).json({
      success: false,
      message: "Vendor not found",
    });

  const vendor = await findVendor(user._id);

  if (!vendor)
    return res.status(404).json({
      success: false,
      message: "Vendor not found",
    });

  vendor.serviceAvailable = !vendor.serviceAvailable;

  await vendor.save();

  return res.status(200).json({
    success: true,
    message: "Vendor Service Updated",
    vendor,
  });
};

export const addFood = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  const { name, category, description, foodType, price, readyTime } =
    req.body as CreateFoodInputs;

  if (!user)
    return res.status(404).json({
      success: false,
      message: "Vendor not found",
    });

  const vendor = await findVendor(user._id);

  if (!vendor)
    return res.status(404).json({
      success: false,
      message: "Vendor not found",
    });

  const files = req.files as [Express.Multer.File];

  const images = files.map((file: Express.Multer.File) => file.filename);

  const food = await Food.create({
    vendorId: vendor._id,
    name,
    description,
    category,
    foodType,
    images: images,
    readyTime,
    price,
    rating: 0,
  });

  vendor.foods.push(food);

  const result = await vendor.save();

  return res.status(201).json({
    success: true,
    vendor: result,
    food,
  });
};

export const getFoods = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (!user)
    return res.status(404).json({
      success: false,
      message: "Vendor not found",
    });

  const foods = await Food.find({ vendorId: user._id });

  return res.status(200).json({
    success: true,
    foods,
  });
};
