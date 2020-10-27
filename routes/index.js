const express = require("express");
const router = express.Router();
const csrf = require("csurf");
const passport = require("passport");

//setting for csrf token
const csrfProtection = csrf();
router.use(csrfProtection);

router.get("/", (req, res) => {
  try {
    const messages = req.flash("error");
    res.render("signup", {
      layout: "main",
      csrfToken: req.csrfToken(),
      messages: messages,
      hasErrors: messages.length > 0,
    });
  } catch (error) {
    return console.log(error);
  }
});

router.get("/page", isLoggedIn, (req, res) => {
  try {
    res.render("page", {
      layout: "main",
      csrfToken: req.csrfToken(),
    });
  } catch (error) {
    return console.log(error);
  }
});

router.get("/profile", isLoggedIn, (req, res) => {
  try {
    res.render("profile", {
      layout: "main",
    });
  } catch (error) {
    return console.log(error);
  }
});

router.post(
  "/",
  passport.authenticate("local.signup", {
    successRedirect: "/profile",
    failureRedirect: "/",
    failureFlash: true,
  }),
  (req, res) => {
    try {
      res.redirect("/page");
    } catch (error) {
      return console.log(error);
    }
  }
);

router.get("/signin", (req, res, next) => {
  res.render("signin", {
    layout: "main",
    csrfToken: req.csrfToken(),
    // messages: messages,
    // hasErrors: messages.length > 0,
  });
});

router.post(
  "/signin",
  passport.authenticate("local.signin", {
    successRedirect: "/page",
    failureRedirect: "/signin",
    failureFlash: true,
  })
);

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}
