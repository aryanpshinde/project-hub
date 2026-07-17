const User = require("../models/user");
const { client, upload } = require("../utils/imagekit");

module.exports.renderRegister = (req, res) => {
  res.render("users/register", { title: "Register" });
};

module.exports.register = async (req, res, next) => {
  try {
    const { email, username, password } = req.body.user;
    const user = new User({ email, username });
    const registerUser = await User.register(user, password);

    req.login(registerUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to ProjectHub");
      res.redirect("/projects");
    });
  } catch (e) {
    if (e.name === "UserExistsError" || e.code === 11000) {
      req.flash(
        "error",
        "An account with that username or email already exists",
      );
    } else {
      const errorMessage =
        process.env.NODE_ENV === "production"
          ? "Oops! something went wrong at our end. Please try again"
          : e.message;
      req.flash("error", errorMessage);
    }
    res.redirect("/register");
  }
};

module.exports.renderLogin = (req, res) => {
  res.render("users/login", { title: "Login" });
};

module.exports.login = (req, res) => {
  req.flash("success", "Welcome back!");
  const redirectUrl = res.locals.returnTo || "/projects";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    req.flash("success", "Goodbye!");
    res.redirect("/projects");
  });
};

module.exports.renderProfile = (req, res) => {
  res.render("users/profile", { title: "Profile" });
};

module.exports.updateProfile = async (req, res) => {
  const { email, username } = req.body.user;
  const userId = req.user._id;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { email, username },
      { new: true, runValidators: true },
    );

    req.login(updatedUser, (err) => {
      if (err) {
        req.flash("error", "Profile updated, but please log in again.");
        return res.redirect("/login");
      }
      req.flash("success", "Profile updated successfully!");
      res.redirect("/profile");
    });
  } catch (e) {
    if (e.name === "ValidationError") {
      req.flash("error", "Invalid input. Please check your data.");
    } else if (e.code === 11000) {
      req.flash("error", "Email or username already exists.");
    } else {
      const errorMessage =
        process.env.NODE_ENV === "production"
          ? "Oops! something went wrong at our end. Please try again"
          : e.message;
      req.flash("error", errorMessage);
    }
    res.redirect("/profile");
  }
};

module.exports.uploadProfilePicture = async (req, res) => {
  if (!req.file) {
    req.flash("error", "No file uploaded.");
    return res.redirect("/profile");
  }

  try {
    if (
      req.user.avatar &&
      req.user.avatar.fileId &&
      req.user.avatar.fileId !== "default-avatar"
    ) {
      await client.files.delete(req.user.avatar.fileId);
    }

    const uploadResponse = await client.files.upload({
      file: req.file.buffer.toString("base64"),
      fileName: `${req.user._id}_${req.file.originalname}`,
      folder: "/project-hub/avatars",
    });

    req.user.avatar.url = uploadResponse.url;
    req.user.avatar.fileId = uploadResponse.fileId;
    req.user.avatar.name = uploadResponse.name;
    await req.user.save();

    req.flash("success", "Profile picture updated successfully!");
    res.redirect("/profile");
  } catch (e) {
    const errorMessage =
      process.env.NODE_ENV === "production"
        ? "Oops! something went wrong at our end. Please try again"
        : e.message;
    req.flash("error", errorMessage);
    res.redirect("/profile");
  }
};

module.exports.deleteProfilePicture = async (req, res) => {
  try {
    if (
      req.user.avatar &&
      req.user.avatar.fileId &&
      req.user.avatar.fileId !== "default-avatar"
    ) {
      await client.files.delete(req.user.avatar.fileId);
    }

    req.user.avatar.url =
      "https://res.cloudinary.com/dxjv8qg0f/image/upload/v1690911685/avatars/default-avatar.png";
    req.user.avatar.fileId = "default-avatar";
    req.user.avatar.name = "default-avatar";
    await req.user.save();

    req.flash("success", "Profile picture deleted successfully!");
    res.redirect("/profile");
  } catch (e) {
    const errorMessage =
      process.env.NODE_ENV === "production"
        ? "Oops! something went wrong at our end. Please try again"
        : e.message;
    req.flash("error", errorMessage);
    res.redirect("/profile");
  }
};
