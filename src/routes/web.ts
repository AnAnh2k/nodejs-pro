import express, { Express } from "express";
const router = express.Router();
import {
  getHomePage,
  getCreateUserPage,
  postCreateUserPage,
} from "../controllers/user.controller";

const webRoute = (app: Express) => {
  router.get("/", getHomePage);

  router.post("/handel-create-user", postCreateUserPage);
  router.get("/create-user", getCreateUserPage);

  router.get("/ada", (req, res) => {
    res.send("Hello, An Đức Anh!");
  });

  router.get("/cuocdoi", (req, res) => {
    res.send("Hello, cuocdoi!");
  });

  app.use("/", router);
};

export default webRoute;
