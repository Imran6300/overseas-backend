const express = require("express")
const UserRouter = express.Router()

const { GetHome } = require("../controllers/usercontroller")

UserRouter.get("/", GetHome)

UserRouter.get()