import {
  createUserAPI,
  deleteUserById,
  getAllUsersAPI,
  getUsersByIdAPI,
  loginAPI,
  postAddProductToCartAPI,
  updateUserById,
} from "controllers/client/api.controller";
import express, { Express } from "express";
import { Request, Response } from "express";
import { getAllUsers } from "services/user.service";
import { checkValidJWT } from "src/middleware/jwt.middleware";

const router = express.Router();

const apiRoutes = (app: Express) => {
  router.post("/add-product-to-cart", postAddProductToCartAPI);
  router.get("/users", checkValidJWT, getAllUsersAPI);
  router.get("/users/:id", getUsersByIdAPI);

  router.post("/users", createUserAPI);
  router.put("/users/:id", updateUserById);

  router.delete("/users/:id", deleteUserById);

  router.post("/login", loginAPI);

  app.use("/api", router);
};

export default apiRoutes;
