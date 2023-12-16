const express = require("express");

const passport = require('passport')

const router = express.Router();

const habitControllers = require('../controllers/habit_contollers');

router.post("/create", habitControllers.create);

module.exports = router;

