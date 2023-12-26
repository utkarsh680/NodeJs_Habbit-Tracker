const express = require("express");

const passport = require('passport')

const router = express.Router();

const habitControllers = require('../controllers/habit_contollers');

router.post("/create", habitControllers.create);

router.get('/delete/:id', habitControllers.delete)

module.exports = router;

