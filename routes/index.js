const express = require("express");
const homeController = require("../controllers/home_controllers");

const router = express.Router();

router.get("/", homeController.home);
router.use("/users", require("./users"));
router.use('/habit', require("./habits"))

module.exports = router;
