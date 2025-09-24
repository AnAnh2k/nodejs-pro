import express from "express";
import "dotenv/config";
import webRoute from "./routes/web";
import getConnection from "./config/database";

const app = express();
const PORT = process.env.PORT || 8080;

//config view engine
app.set("view engine", "ejs");
// app.set("views", "./src/views");
app.set("views", __dirname + "/views");

//config request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//config static files
app.use(express.static("public"));

//config routes
webRoute(app);

getConnection();
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
