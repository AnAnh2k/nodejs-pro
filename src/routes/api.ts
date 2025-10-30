import {
  createUserAPI,
  deleteUserById,
  fetchAccountApi,
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
  router.get("/users", getAllUsersAPI);
  router.get("/users/:id", getUsersByIdAPI);

  router.post("/users", createUserAPI);
  router.put("/users/:id", updateUserById);

  router.delete("/users/:id", deleteUserById);

  router.post("/login", loginAPI);

  router.get("/account", fetchAccountApi);

  app.use("/api", checkValidJWT, router);
};

export default apiRoutes;
