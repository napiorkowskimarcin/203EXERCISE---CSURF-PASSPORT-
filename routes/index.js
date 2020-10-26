const express = require("express");
const router = express.Router();
const csrf = require("csurf");

//setting for csrf token
const csrfProtection = csrf();
router.use(csrfProtection);

router.get("/", (req, res) => {
  try {
    res.render("signup", {
      layout: "main",
      csrfToken: req.csrfToken(),
    });
  } catch (error) {
    return console.log(error);
  }
});

router.get("/page", (req, res) => {
  try {
    res.render("page", {
      layout: "main",
      csrfToken: req.csrfToken(),
    });
  } catch (error) {
    return console.log(error);
  }
});

router.post("/", (req, res) => {
  try {
    res.redirect("/page");
  } catch (error) {
    return console.log(error);
  }
});

module.exports = router;
