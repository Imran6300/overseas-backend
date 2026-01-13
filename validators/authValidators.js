const { check } = require("express-validator")

/* =========================
   LOGIN VALIDATION
========================= */
exports.loginValidators = [
  check("email")
    .isEmail()
    .withMessage("Please enter a valid email"),

  check("password")
    .notEmpty()
    .withMessage("Password is required"),
]

/* =========================
   SIGNUP VALIDATION
========================= */
exports.signupValidators = [
  check("name")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("Name can only contain letters"),

  check("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),

  check("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/[A-Z]/)
    .withMessage("Password must contain an uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain a lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain a number")
    .matches(/[\W]/)
    .withMessage("Password must contain a special character"),

  check("confirmpassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match")
    }
    return true
  }),
]
