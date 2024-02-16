import { NextFunction, Request, Response } from "express";
import { AuthPayload } from "../dto";
import { validateSignature } from "../utility/passwordUtility";

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validate = await validateSignature(req);

  if (!validate)
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });

  next();
};
