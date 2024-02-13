import express from "express";

import adminRoutes from "./admin.routes";
import vendorRoutes from "./vendor.routes";

const router = express.Router();

router.use("/admin", adminRoutes);
router.use("/vendor", vendorRoutes);

export default router;
