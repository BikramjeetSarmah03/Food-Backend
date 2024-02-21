import express from "express";
import {
  getFoodAvailability,
  getFoodsIn30Min,
  getTopResturants,
  getResturantById,
  searchFoods,
} from "../controllers";

const router = express.Router();

// food availability
router.get("/:pincode", getFoodAvailability);

// top resturants
router.get("/top-resturants/:pincode", getTopResturants);

// foods available in 38 minutes
router.get("/food-in-30-min/:pincode", getFoodsIn30Min);

// search food
router.get("/search/:pincode", searchFoods);

// find resturant by id
router.get("/resturant/:id", getResturantById);

export default router;
