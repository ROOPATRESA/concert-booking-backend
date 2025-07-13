var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const QRCode = require("qrcode");
const User = require("../models/userModel");
const Concert = require("../models/concertModel");
const { validationResult } = require("express-validator");
const { validateEmail, validatePassword } = require("./customValidators");

// ✅ Authentication Middleware
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userEmail) {
    return next();
  }
  res.redirect("/login");
};

router.get("/", async (req, res) => {
  try {
    const concerts = await Concert.find();
    console.log("▶ route / hit");
    console.log("▶ concerts.length =", concerts.length);

    res.render("home", {
      concerts,
      userEmail: req.session.userEmail || null,
      userName: req.session.userName || "Guest",
    });
  } catch (err) {
    console.error(err);
  }
});

// ✅ Login & Signup Routes
router.get("/login", (req, res) =>
  res.render("login", { errors: [], message: null })
);
router.get("/signup", (req, res) =>
  res.render("signup", { message: null, error: null })
);

// ✅ Login Route
router.post("/login", [validateEmail, validatePassword], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("login", { errors: errors.array(), message: null });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.render("login", {
        message: "Incorrect Email Address.",
        errors: [],
      });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.render("login", {
        message: "Incorrect password.",
        errors: [],
      });

    req.session.userId = user._id;
    req.session.userEmail = user.email;
    req.session.userName = user.name;
    req.session.userRole = user.role;

    res.redirect("/concert/retrieve_concert");
  } catch (error) {
    console.error(error);
    res.status(500).render("login", { message: "Server Error", errors: [] });
  }
});

// ✅ Signup Route
router.post("/signup", async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  const role = email === "admin@gmail.com" ? "admin" : "user";

  if (password !== confirmPassword) {
    return res.render("signup", {
      message: "Passwords do not match",
      error: null,
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.render("signup", {
        message: "Email already taken",
        error: null,
      });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    res.redirect("/login");
  } catch (error) {
    console.error(error);
    res.status(500).render("signup", { message: "Server Error", error: null });
  }
});

// ✅ Logout Route
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      res.send("Error");
    } else {
      res.redirect("/login");
    }
  });
});

// ✅ Booking Route
router.get("/booking/:id", isAuthenticated, async (req, res) => {
  try {
    const concert = await Concert.findById(req.params.id);
    if (!concert) return res.status(404).send("Concert not found");

    res.render("booking", {
      concert,
      userEmail: req.session.userEmail,
      userName: req.session.userName || "Guest", // ✅ Pass `userName`
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// ✅ Export Router
module.exports = router;
