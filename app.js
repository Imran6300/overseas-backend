//core modules
const path = require("path");

//external modules
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
//cookies and sessions
const cookieParser = require("cookie-parser")
const session = require("express-session")
const MongoDBStore = require("connect-mongodb-session")(session)


//routes
const { UserRouter } = require("./routes/userroute")
const { AuthRouter } = require("./routes/authrouter")
const { HostRouter } = require("./routes/hostrouter")

const app = express();

app.set("view engine", "ejs");
app.set("ejs", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("trust proxy", 1);

//this helps us to read cookies
app.use(cookieParser())

const DB_PATH = process.env.DB;

//new session collection

const Store = new MongoDBStore({
  uri: DB_PATH,
  collection: "overseas_sessions"
})

Store.on("error", (error) => {
  console.error("Session store error:", error);
})

//session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: Store,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", // CSRF protection
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

app.use(req, res, next => {
  req.isLoggedIn = req.session.isLoggedIn || false;
  next()
})

//middle wares

app.use("/auth", AuthRouter)

app.use("/host", (req, res, next) => {
  if (!req.isLoggedIn) {
    return res.redirect("/auth/login")
  }
  next()
})

app.use("/host", HostRouter)

app.use(UserRouter)

mongoose.connect(DB_PATH).then(() => {
  console.log("Connected To MongoDB");
  app.listen(process.env.PORT, () => {
    console.log("Server Is Started....");
  });
}).catch(err => {
  console.log("error while connecting to db", err)
})

