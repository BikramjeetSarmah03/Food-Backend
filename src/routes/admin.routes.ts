import express from "express";
import { createVendor, getAllVendors, getVendorById } from "../controllers";

const router = express.Router();

router.post("/vendor", createVendor);
router.get("/vendors", getAllVendors);
router.get("/vendor/:id", getVendorById);

export default router;
