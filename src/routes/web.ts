import express, { Express } from "express";
const router = express.Router();
import { getHomePage, getCreateUserPage } from "../controllers/user.controller";

const webRoute = (app: Express) => {
  router.get("/", getHomePage);

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
