// ================= CORE MODULES =================
const path = require("path");

// ================= EXTERNAL MODULES =================
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

// ================= COOKIES & SESSIONS =================
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo").default; // ✅ FIXED

// ================= ROUTES =================
const { AuthRouter } = require("./routes/authrouter");

// ================= APP INIT =================
const app = express();

// ================= BASIC MIDDLEWARE =================
app.set("trust proxy", 1);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Optional (safe to keep)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// ================= CORS =================
// ================= CORS (FIXED) =================
const allowedOrigins = [
  "https://khizar-overseas.vercel.app"
];

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Vary", "Origin"); // 🔥 ADD THIS
  }

  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});



// ================= SESSION (connect-mongo v6 CORRECT) =================
app.use(
  session({
    name: "overseas.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,

    store: MongoStore.create({
      mongoUrl: process.env.DB,
      collectionName: "overseas_sessions",

      // 🔥 THESE TWO LINES FIX YOUR ISSUE
      ttl: 60 * 60 * 24,          // 1 day
      autoRemove: "native",      // MongoDB TTL cleanup
    }),

    cookie: {
      path: "/",
      httpOnly: true,
      secure: true, // true only with HTTPS
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

// ================= AUTH STATE =================
app.use((req, res, next) => {
  req.isLoggedIn = !!req.session.isLoggedIn;
  next();
});

// ================= ROUTES =================
app.use("/auth", AuthRouter);

// ================= DB + SERVER =================
mongoose
  .connect(process.env.DB)
  .then(() => {
    console.log("Connected To MongoDB");
    app.listen(process.env.PORT, () => {
      console.log(`Server Is Started on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB error:", err);
  });
