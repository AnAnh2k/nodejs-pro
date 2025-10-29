import { Request, Response, NextFunction } from "express";

const checkValidJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  next();
};

export { checkValidJWT };
