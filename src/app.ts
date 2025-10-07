import express from "express";
import "dotenv/config";
import webRoute from "./routes/web";
import getConnection from "./config/database";
import initDatabase from "config/seed";
import passport from "passport";
import confidPassportLocal from "src/middleware/passport.local";

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

//config passport
app.use(passport.initialize());
confidPassportLocal();

//config routes
webRoute(app);

//seeding data
initDatabase();

//handle 404 not found
app.use((req, res) => {
  res.render("client/auth/notfound");
});
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

function shutdown() {
  server.close(() => process.exit(0));
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
process.once("SIGUSR2", () => {
  shutdown();
  process.kill(process.pid, "SIGUSR2");
});
