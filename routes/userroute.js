const express = require("express")
const UserRouter = express.Router()

const { PostCounselingForm } = require("../controllers/usercontroller")

UserRouter.post("/api/counseling", PostCounselingForm)

module.exports = { UserRouter }