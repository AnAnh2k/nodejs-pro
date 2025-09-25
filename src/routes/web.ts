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

const webRoute = (app: Express) => {
  router.get("/", getHomePage);

  router.post("/handle-delete-user/:id", postDeleteUser);

  router.get("/view-user/:id", getViewUser);
  router.post("/handle-update-user/:id", postUpdateUser);
  router.post("/handle-create-user", postCreateUser);
  router.get("/create-user", getCreateUserPage);

  app.use("/", router);
};

export default webRoute;
