const express = require("express");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const path = require("path");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const { MongoStore, createWebCryptoAdapter } = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const User = require("./models/user");

const projectRoutes = require("./routes/projects");
const userRoutes = require("./routes/users");

require("dotenv").config({ quiet: true });

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("Mongo connection open");
  })
  .catch((e) => {
    console.log("Mongo Connection Error");
    console.log(e);
  });

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

const storeMongo = MongoStore.create({
  mongoUrl: process.env.DB_URL,
  touchAfter: 24 * 60 * 60,
  cryptoAdapter: createWebCryptoAdapter({
    secret: process.env.SESSION_SECRET,
  }),
});

const sessionConfig = {
  store: storeMongo,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

app.use("/projects", projectRoutes);
app.use("/", userRoutes);

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
