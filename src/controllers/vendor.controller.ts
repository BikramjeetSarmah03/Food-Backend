import { NextFunction, Request, Response } from "express";

import { VendorLoginInput } from "../dto/vendor.dto";
import { findVendor } from "./admin.controller";
import { validatePassword } from "../utility/passwordUtility";

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

  res.status(200).json({
    success: true,
    vendor,
  });
};
