const express = require("express");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const morgan = require("morgan");
const config = require("./config/config");
const bodyParser = require("body-parser");
const validator = require("express-validator");
//passport:
const passport = require("passport");
const flash = require("connect-flash");

//start a program
const app = express();

//for view engine
const Handlebars = require("handlebars");

//to be able to use put and delete later on
const methodOverride = require("method-override");
//for csrf token
const session = require("express-session");

//set a port
const PORT = process.env.PORT || 1000;

const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");

//load mongoose
mongoose.connect(config.db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

//set a DB connection
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected to the database");
});

//session - to make csrf possible
app.use(
  session({ secret: "sessionsecret", resave: false, saveUninitialized: false })
);
//uses a session! after session initialized
app.use(flash());
//paspport - after flash!
app.use(passport.initialize());
app.use(passport.session());

//allow bodyParser to recognize a body
app.use(bodyParser.urlencoded({ extended: false }));
// // //express validator = after bodyParser!
app.use(validator());
app.use(bodyParser.json());

//load a passport
require("./config/passport");
//load handlebars and set .handlebars to .hbs
app.engine(
  ".hbs",
  exphbs({
    defaultLayout: "main",
    extname: ".hbs",
    handlebars: allowInsecurePrototypeAccess(Handlebars),
  })
);
app.set("view engine", ".hbs");

//login data
app.use(morgan("dev"));

//routes
app.use("/", require("./routes/index"));

//start listening
app.listen(PORT, () => console.log(`Server has started on: ${PORT}`));
