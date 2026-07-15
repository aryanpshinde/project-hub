const express = require("express");
const router = express.Router();
const users = require("../controllers/users");
const passport = require("passport");
const { storeReturnTo, isLoggedIn, validateProfile } = require("../middleware");

router.route("/register").get(users.renderRegister).post(users.register);

router
  .route("/login")
  .get(users.renderLogin)
  .post(
    storeReturnTo,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    users.login,
  );

router.post("/logout", users.logout);

router
  .route("/profile")
  .get(isLoggedIn, users.renderProfile)
  .put(isLoggedIn, validateProfile, users.updateProfile);

module.exports = router;
