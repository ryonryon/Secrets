const express = require("express");
const BodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(BodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true
});

const userScheme = new mongoose.Schema({
  email: String,
  password: String
});

const secret = "Thisisourlittlesecret.";
userScheme.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });

const User = new mongoose.model("User", userScheme);

app.get("/", function(req, res) {
  res.render("home");
});

app
  .route("/login")
  .get(function(req, res) {
    res.render("login");
  })
  .post(function(req, res) {
    const userName = req.body.username;
    const password = req.body.password;

    User.findOne({ email: userName }, function(err, foundUser) {
      if (!err) {
        if (foundUser) {
          if (foundUser.password === password) {
            res.render("secrets");
          }
        }
      } else {
        console.log(err);
      }
    });
  });

app
  .route("/register")
  .get(function(req, res) {
    res.render("register");
  })
  .post(function(req, res) {
    const newUser = new User({
      email: req.body.username,
      password: req.body.password
    });

    newUser.save(function(err) {
      if (!err) {
        res.render("secrets");
      } else {
        console.log(err);
      }
    });
  });

app.listen(3000, function() {
  console.log("server is running on port 3000");
});
