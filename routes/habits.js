const express = require("express");

const passport = require('passport')

const router = express.Router();

const habitControllers = require('../controllers/habit_contollers');

router.get("/profile", passport.checkAuthentication, habitControllers.profile);
router.get('/setHabitDetails', habitControllers.SetHabitDetails);
router.post("/habit", habitControllers.create);

module.exports = router;

