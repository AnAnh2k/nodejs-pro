import { JsonWebTokenError } from "./../../node_modules/@types/jsonwebtoken/index.d";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { log } from "console";

const checkValidJWT = (req: Request, res: Response, next: NextFunction) => {
  const path = req.path;
  const whiteList = ["/login", "/add-product-to-cart"];

  const isWhitelist = whiteList.some((route) => route === path);
  if (isWhitelist === true) {
    return next();
  }

  const token = req.headers["authorization"]?.split(" ")[1];
  try {
    const dataDecoded: any = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: dataDecoded.id,
      username: dataDecoded.username,
      password: "",
      fullName: "",
      address: "",
      phone: "",
      accountType: dataDecoded.accountType,
      avatar: dataDecoded.avatar,
      roleId: dataDecoded.roleId,
      role: dataDecoded.role,
    };
    next();
  } catch (error) {
    res.status(401).json({
      data: null,
      message: "Token không hợp lệ (không truyền lên token hoặc token hết hạn)",
    });
  }
};

export { checkValidJWT };
