// ================= CORE MODULES =================
const path = require("path");

// ================= EXTERNAL MODULES =================
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
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
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

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
    }),

    cookie: {
      httpOnly: true,
      secure: false, // true only with HTTPS in prod
      sameSite: "lax",
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
