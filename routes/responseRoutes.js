const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const authMiddleware = require("../middleware/middleware.js");

const Attempt = require("../models/attemptSchema");

router.get("/");

module.exports = router;
