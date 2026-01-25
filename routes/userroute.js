const express = require("express")
const UserRouter = express.Router()

const { PostCounselingForm, PostAssessmentForm } = require("../controllers/usercontroller")

UserRouter.post("/api/counseling", PostCounselingForm)
UserRouter.post("/api/assessment", PostAssessmentForm)

module.exports = { UserRouter }