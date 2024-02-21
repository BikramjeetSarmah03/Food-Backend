import express from "express";
import { authenticate } from "../middlewares";
import {
  customerLogin,
  customerSignUp,
  customerVerify,
  getCustomerProfile,
  requestOTP,
  updateCustomerProfile,
} from "../controllers";

const router = express.Router();

// signup
router.post("/signup", customerSignUp);

// login
router.post("/login", customerLogin);

// authentication
router.use(authenticate);

// verify account
router.patch("/verify", customerVerify);

// otp
router.get("/otp", requestOTP);

// profile
router.get("/profile", getCustomerProfile);

// edit profile
router.patch("/profile", updateCustomerProfile);

// cart
// order

// payment

export default router;
