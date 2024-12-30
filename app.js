process.noDeprecation = true;
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const blogRoutes = require("./routes/blogRoutes");
const authRoutes = require("./routes/authRoutes");
const { checkUser } = require("./middleware/authMiddleware");
const punycode = require('punycode/');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.static("public"));


const PORT = 3000;

// Database Connection

const DB_URI = process.env.DB_URI || "mongodb://127.0.0.1:27017/myblog";

mongoose.connect("mongodb://127.0.0.1:27017/Blog_miniProject_DB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));


// Register view engine
app.set("view engine", "ejs");

// Middleware and Static Files
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Authentication Middleware
app.get("*", checkUser);

// Routes
app.get("/", (req, res) => {
  res.redirect("/blogs");
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});

app.use("/blogs", blogRoutes);
app.use(authRoutes);

// 404 Error Handler
app.use((req, res) => {
  res.status(404).render("404", { title: "404" });
});

// Centralized Error-Handling Middleware (Optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("500", { title: "Error", message: "Something went wrong!" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});