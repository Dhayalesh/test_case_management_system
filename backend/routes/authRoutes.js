const express = require("express");
const router = express.Router();
const { loginUser } = require("../controllers/authController");

router.get("/login", loginUser);

module.exports = router;
