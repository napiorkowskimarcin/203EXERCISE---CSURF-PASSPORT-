const passport = require("passport");
const User = require("../models/User");
const LocalStrategy = require("passport-local").Strategy;

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(
  "local.signup",
  new LocalStrategy(
    {
      usernameField: "name",
      passwordField: "password",
      passReqToCallback: true,
    },
    (req, name, password, done) => {
      req.checkBody("name", "invalid name").notEmpty();
      req
        .checkBody("password", "minimum 4 characters required")
        .notEmpty()
        .isLength({ min: 4 });
      const errors = req.validationErrors();
      if (errors) {
        const messages = [];
        errors.forEach((error) => messages.push(error.msg));
        return done(null, false, req.flash("error", messages));
      }
      User.findOne({ name: name }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (user) {
          return done(null, false, { message: "Name is already in use" });
        }
        const newUser = new User();
        newUser.name = name;
        newUser.password = newUser.encryptPassword(password);
        newUser.save((err, result) => {
          if (err) {
            return done(err);
          }
          return done(null, newUser);
        });
      });
    }
  )
);

passport.use(
  "local.signin",
  new LocalStrategy(
    {
      usernameField: "name",
      passwordField: "password",
      passReqToCallback: true,
    },
    (req, name, password, done) => {
      req.checkBody("name", "invalid name").notEmpty();
      req.checkBody("password", "minimum 4 characters required").notEmpty();

      const errors = req.validationErrors();
      if (errors) {
        const messages = [];
        errors.forEach((error) => messages.push(error.msg));
        return done(null, false, req.flash("error", messages));
      }
      User.findOne({ name: name }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: "No user found" });
        }
        if (!user.validPassword(password)) {
          return done(null, false, { message: "Wrong password " });
        }
        return done(null, user);
      });
    }
  )
);
