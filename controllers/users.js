const User = require("../models/user");

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
