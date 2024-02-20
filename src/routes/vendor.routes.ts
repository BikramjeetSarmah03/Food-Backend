import express from "express";

import {
  addFood,
  getFoods,
  getVendorProfile,
  updateVendorCoverImage,
  updateVendorProfile,
  updateVendorService,
  vendorLogin,
} from "../controllers";
import { authenticate } from "../middlewares";
import { multipleUpload } from "../utility/multer";

const router = express.Router();

router.post("/login", vendorLogin);

// Authenticate middleware. Routes below needs authentication
router.use(authenticate);
router.get("/profile", getVendorProfile);
router.patch("/profile", updateVendorProfile);
router.patch("/service", updateVendorService);
router.patch(
  "/coverimage",
  multipleUpload("images", 10),
  updateVendorCoverImage
);

router.post("/food", multipleUpload("images", 10), addFood);
router.get("/foods", getFoods);

export default router;
