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
import fileUploadMiddlelware from "src/middleware/multer";
import { getProductPage } from "src/controllers/client/client.controller";
import {
  getAdminCreateProductPage,
  postAdminCreateProductPage,
} from "src/controllers/admin/product.controller";

const webRoute = (app: Express) => {
  router.get("/", getHomePage);
  //client page
  router.get("/product/:id", getProductPage);

  //admin page
  router.get("/admin", getDashboardPage);
  router.get("/admin/user", getAdminUserPage);
  router.get("/admin/create-user", getCreateUserPage);
  router.post(
    "/admin/handle-create-user",
    fileUploadMiddlelware("avatar"),
    postCreateUser
  );
  router.get("/admin/view-user/:id", getViewUser);
  router.post("/admin/delete-user/:id", postDeleteUser);
  router.post(
    "/admin/update-user/:id",
    fileUploadMiddlelware("avatar"),
    postUpdateUser
  );

  router.get("/admin/product", getAdminProductPage);
  router.get("/admin/create-product", getAdminCreateProductPage);

  router.post(
    "/admin/handle-create-product",
    fileUploadMiddlelware("image", "images/product"),
    postAdminCreateProductPage
  );
  router.get("/admin/order", getAdminOrderPage);

  app.use("/", router);
};

export default webRoute;
