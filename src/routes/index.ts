import express from "express";

import adminRoutes from "./admin.routes";
import vendorRoutes from "./vendor.routes";
import shoppingRoutes from "./shopping.routes";
import customerRoutes from "./customer.routes";

const router = express.Router();

router.use("/admin", adminRoutes);
router.use("/vendor", vendorRoutes);
router.use("/customer", customerRoutes);
router.use("/", shoppingRoutes);

export default router;
