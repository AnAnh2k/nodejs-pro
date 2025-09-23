import express, { Express } from "express";
const router = express.Router();

const webRoute = (app: Express) => {
  router.get("/", (req, res) => {
    res.render("home");
  });

  router.get("/ada", (req, res) => {
    res.send("Hello, An Đức Anh!");
  });

  router.get("/cuocdoi", (req, res) => {
    res.send("Hello, cuocdoi!");
  });

  app.use("/", router);
};

export default webRoute;
