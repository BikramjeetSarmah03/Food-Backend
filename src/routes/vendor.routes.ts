import express from "express";
import {
  getVendorProfile,
  updateVendorProfile,
  updateVendorService,
  vendorLogin,
} from "../controllers";
import { authenticate } from "../middlewares";

const router = express.Router();

router.post("/login", vendorLogin);

// Authenticate middleware. Routes below needs authentication
router.use(authenticate);
router.get("/profile", getVendorProfile);
router.patch("/profile", updateVendorProfile);
router.patch("/service", updateVendorService);

export default router;
