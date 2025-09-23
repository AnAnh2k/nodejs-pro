import express from "express";

const app = express();
const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("Hello, World! An Đức Anh");
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
