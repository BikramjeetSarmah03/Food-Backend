import express from "express";
import { vendorLogin } from "../controllers";

const router = express.Router();

router.post("/login", vendorLogin);

export default router;
