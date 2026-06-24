const express = require("express");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const path = require("path");

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

app.get("/", (req, res) => {
  res.render("home");
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
