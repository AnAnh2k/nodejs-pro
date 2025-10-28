import {
  createUserAPI,
  getAllUsersAPI,
  getUsersByIdAPI,
  postAddProductToCartAPI,
} from "controllers/client/api.controller";
import express, { Express } from "express";
import { Request, Response } from "express";
import { getAllUsers } from "services/user.service";

const router = express.Router();

const apiRoutes = (app: Express) => {
  router.post("/add-product-to-cart", postAddProductToCartAPI);
  router.get("/users", getAllUsersAPI);
  router.get("/users/:id", getUsersByIdAPI);

  router.post("/users", createUserAPI);

  app.use("/api", router);
};

export default apiRoutes;
