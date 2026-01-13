const express = require("express");
const AuthRouter = express.Router();

const authController = require("../controllers/authController");
const {
  loginValidators,
  signupValidators,
} = require("../validators/authValidators");

// Login
AuthRouter.get("/login", authController.GetLogin);
AuthRouter.post("/login", loginValidators, authController.PostLogin);

// Signup
AuthRouter.get("/signup", authController.GetSignup);
AuthRouter.post("/signup", signupValidators, authController.PostSignup);

// Logout (POST — IMPORTANT)
AuthRouter.post("/logout", authController.PostLogout);

// Auth check
AuthRouter.get("/me", authController.GetMe);

module.exports = { AuthRouter };