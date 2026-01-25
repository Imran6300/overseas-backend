const express = require("express")
const UserRouter = express.Router()

const { PostCounselingForm, PostAssessmentForm, PostContactForm } = require("../controllers/usercontroller")

UserRouter.post("/api/counseling", PostCounselingForm)
UserRouter.post("/api/assessment", PostAssessmentForm)
UserRouter.post("/api/contactform", PostContactForm)

module.exports = { UserRouter }