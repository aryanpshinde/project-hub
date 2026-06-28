const express = require("express");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const path = require("path");
const ExpressError = require("./utils/ExpressError");

const projectRoutes = require("./routes/projects");

require("dotenv").config({ quiet: true });

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("Mongo connection open");
  })
  .catch((e) => {
    console.log("Mnogo Connection Error");
    console.log(e);
  });

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

app.use("/projects", projectRoutes);

app.get("/", (req, res) => {
  res.render("home");
});

app.all("/{*path}", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Oh, no something went wrong";

  if (err.name === "CastError") {
    statusCode = 404;
    message = "Page Not Found";
  }
  const safeErr = {
    statusCode,
    message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  };
  res.status(statusCode).render("error", { err: safeErr });
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
