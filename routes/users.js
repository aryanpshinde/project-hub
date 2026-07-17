const express = require("express");
const router = express.Router();
const users = require("../controllers/users");
const passport = require("passport");
const { storeReturnTo, isLoggedIn, validateProfile } = require("../middleware");
const { upload } = require("../utils/imagekit");

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

router
  .route("/profile/avatar")
  .post(isLoggedIn, upload.single("avatar"), users.uploadProfilePicture)
  .delete(isLoggedIn, users.deleteProfilePicture);

module.exports = router;
