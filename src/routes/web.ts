import express, { Express } from "express";
const router = express.Router();
import {
  getHomePage,
  getCreateUserPage,
  postCreateUser,
  postDeleteUser,
  getViewUser,
  postUpdateUser,
} from "../controllers/user.controller";
import { log } from "console";
import { get } from "http";
import {
  getDashboardPage,
  getAdminUserPage,
  getAdminProductPage,
  getAdminOrderPage,
} from "../controllers/admin/dashboard.controller";

const webRoute = (app: Express) => {
  router.get("/", getHomePage);

  router.post("/handle-delete-user/:id", postDeleteUser);

  router.get("/view-user/:id", getViewUser);
  router.post("/handle-update-user/:id", postUpdateUser);
  router.post("/handle-create-user", postCreateUser);

  //admin page
  router.get("/admin", getDashboardPage);
  router.get("/admin/user", getAdminUserPage);
  router.get("/admin/create-user", getCreateUserPage);

  router.get("/admin/product", getAdminProductPage);
  router.get("/admin/order", getAdminOrderPage);

  app.use("/", router);
};

export default webRoute;
