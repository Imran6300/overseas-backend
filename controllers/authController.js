const { validationResult } = require("express-validator");
const bcryptjs = require("bcryptjs");
const User = require("../models/user");

/* =========================
   GET LOGIN (OPTIONAL INFO)
========================= */
exports.GetLogin = (req, res) => {
  res.status(200).json({
    success: true,
    isLoggedIn: !!req.session.isLoggedIn,
    title: "Login Page",
  });
};

/* =========================
   POST LOGIN
========================= */
exports.PostLogin = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        isLoggedIn: false,
        errors: errors.array().map(err => err.msg),
      });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(422).json({
        success: false,
        isLoggedIn: false,
        errors: ["User does not exist"],
      });
    }

    // Compare password
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(422).json({
        success: false,
        isLoggedIn: false,
        errors: ["Invalid password"],
      });
    }

    // 🔐 Regenerate session (IMPORTANT)
    req.session.regenerate(err => {
      if (err) {
        return res.status(500).json({
          success: false,
          isLoggedIn: false,
          errors: ["Session error"],
        });
      }

      req.session.isLoggedIn = true;
      req.session.user = {
        _id: user._id,
        name: user.name,
        email: user.email,
      };

      req.session.save(() => {
        res.status(200).json({
          success: true,
          isLoggedIn: true,
          user: req.session.user,
        });
      });
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      isLoggedIn: false,
      errors: ["Server error"],
    });
  }
};

/* =========================
   GET SIGNUP (OPTIONAL INFO)
========================= */
exports.GetSignup = (req, res) => {
  res.status(200).json({
    success: true,
    isLoggedIn: false,
    title: "Signup Page",
  });
};

/* =========================
   POST SIGNUP
========================= */
exports.PostSignup = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        isLoggedIn: false,
        errors: errors.array().map(err => err.msg),
      });
    }

    const { name, email, password } = req.body;

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(422).json({
        success: false,
        isLoggedIn: false,
        errors: ["Email already registered"],
      });
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 12);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // 🔐 Regenerate session after signup (recommended)
    req.session.regenerate(err => {
      if (err) {
        return res.status(500).json({
          success: false,
          isLoggedIn: false,
          errors: ["Session error"],
        });
      }

      req.session.isLoggedIn = true;
      req.session.user = {
        _id: user._id,
        name: user.name,
        email: user.email,
      };

      req.session.save(() => {
        res.status(201).json({
          success: true,
          isLoggedIn: true,
          user: req.session.user,
        });
      });
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      isLoggedIn: false,
      errors: ["Something went wrong. Please try again."],
    });
  }
};

/* =========================
   POST LOGOUT
========================= */
exports.PostLogout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Logout failed",
      });
    }

    // 🔥 Clear session cookie
    res.clearCookie("overseas.sid", {
      httpOnly: true,
      sameSite: "lax",
    });

    res.status(200).json({
      success: true,
      isLoggedIn: false,
      message: "Logged out successfully",
    });
  });
};

/* =========================
   AUTH CHECK (ME)
========================= */
exports.GetMe = (req, res) => {
  if (!req.session.isLoggedIn) {
    return res.status(401).json({
      success: false,
      isLoggedIn: false,
    });
  }

  res.status(200).json({
    success: true,
    isLoggedIn: true,
    user: req.session.user,
  });
};
