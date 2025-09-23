import express from "express";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 8080;

//config view engine
app.set("view engine", "ejs");
// app.set("views", "./src/views");
app.set("views", __dirname + "/views");

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/ada", (req, res) => {
  res.send("Hello, An Đức Anh!");
});

app.get("/cuocdoi", (req, res) => {
  res.send("Hello, cuocdoi!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
