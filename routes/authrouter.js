const express = require("express")
const AuthRouter = express.Router()

const {
  GetLogin,
  PostLogin,
  PostLogout,
  GetSignup,
  PostSignup,
} = require("../controllers/authcontroller")

AuthRouter.get("/login", GetLogin)

AuthRouter.post("/login", PostLogin)

AuthRouter.get("/signup", GetSignup)

AuthRouter.post("/signup", PostSignup)

AuthRouter.get("/logout", PostLogout)

module.exports = { AuthRouter }