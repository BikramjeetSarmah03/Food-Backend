import { NextFunction, Request, Response } from "express";
import Vendor from "../models/vendor.model";
import { FoodDoc } from "../models/food.model";

export const getFoodAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { pincode } = req.params;

  const result = await Vendor.find({
    pincode: pincode,
    serviceAvailable: true,
  })
    .sort([["rating", "descending"]])
    .populate("foods");

  if (result.length <= 0) {
    return res.status(400).json({
      success: false,
      message: "Data not found",
    });
  }

  return res.status(200).json({
    success: true,
    foods: result,
  });
};

export const getTopResturants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { pincode } = req.params;

  const result = await Vendor.find({
    pincode: pincode,
    serviceAvailable: true,
  })
    .sort([["rating", "descending"]])
    .limit(10);

  if (result.length <= 0) {
    return res.status(400).json({
      success: false,
      message: "Data not found",
    });
  }

  return res.status(200).json({
    success: true,
    foods: result,
  });
};

export const getFoodsIn30Min = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { pincode } = req.params;

  const vendors = await Vendor.find({
    pincode: pincode,
    serviceAvailable: true,
  }).populate("foods");

  if (vendors.length <= 0) {
    return res.status(400).json({
      success: false,
      message: "Data not found",
    });
  }

  let foodResult: any = [];
  vendors.map((vendor) => {
    const foods = vendor.foods as [FoodDoc];

    foodResult.push(...foods.filter((food) => food.readyTime <= 30));
  });

  return res.status(200).json({
    success: true,
    foods: foodResult,
  });
};

export const searchFoods = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { pincode } = req.params;

  const vendors = await Vendor.find({
    pincode: pincode,
  }).populate("foods");

  if (vendors.length <= 0) {
    return res.status(400).json({
      success: false,
      message: "Data not found",
    });
  }

  let foodResult: any = [];
  vendors.map((vendor) => foodResult.push(...vendor.foods));

  return res.status(200).json({
    success: true,
    foods: foodResult,
  });
};

export const getResturantById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  const resturant = await Vendor.findById(id).populate("foods");

  if (!resturant) {
    return res.status(400).json({
      success: false,
      message: "Resturant not found",
    });
  }

  return res.status(200).json({
    success: true,
    resturant,
  });
};
