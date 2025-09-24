import express, { Express } from "express";
const router = express.Router();
import {
  getHomePage,
  getCreateUserPage,
  postCreateUser,
  postDeleteUser,
} from "../controllers/user.controller";

const webRoute = (app: Express) => {
  router.get("/", getHomePage);

  router.post("/handle-delete-user/:id", postDeleteUser);
  router.post("/handel-create-user", postCreateUser);
  router.get("/create-user", getCreateUserPage);

  app.use("/", router);
};

export default webRoute;
