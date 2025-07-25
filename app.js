var createError = require("http-errors");
var express = require("express");
require("dotenv").config();
var path = require("path");
const multer = require("multer");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const session = require("express-session");
const bcrypt = require("bcrypt");
var cors = require("cors");

// Import Routers
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var concertRouter = require("./routes/concert");
var bookingRouter = require("./routes/booking");
var apiRouter = require("./routes/api");

const db = require("./database/db"); // Ensure DB connection is established

var app = express();

app.use(
  cors({
    origin: "http://localhost:5000", // <-- your frontend origin, adjust if different
    credentials: true, // <-- enable cookies and credentials
  })
);
app.use("/tickets", express.static(path.join(__dirname, "tickets")));

// 🔹 Middleware Setup
app.use(logger("dev"));
app.use(express.json()); // Ensure JSON body parsing
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// 🔹 Session Setup
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default-secret-key", // Use env variable for session secret
    resave: false,
    saveUninitialized: true,
  })
);

// 🔹 View Engine Setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// 🔹 Use Routers
app.use("/api", apiRouter);
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/concert", concertRouter);
app.use("/booking", bookingRouter);
// 🔹 Serve Static Files
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));
// 🔹 Catch 404 and Forward to Error Handler
app.use(function (req, res, next) {
  next(createError(404));
});

// 🔹 Error Handler (Supports API Responses)
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {}; // Display detailed error in development mode

  res.status(err.status || 500);

  // If the request is an API request, return JSON instead of rendering a page
  if (req.originalUrl.startsWith("/api")) {
    return res.json({ error: err.message });
  }

  // Render Error Page for Non-API Requests
  res.render("error");
});

module.exports = app;
