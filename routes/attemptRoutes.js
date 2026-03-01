// routes/attempt.js
const express = require("express");
const router = express.Router();
const Attempt = require("../models/attemptSchema");
const authMiddleware = require("../middleware/middleware");

router.get("/all", authMiddleware, async (req, res) => {
  try {
    const attempts = await Attempt.find({});
    res.status(201).json({ attempts });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/by/:form_id", async (req, res) => {
  try {
    const { form_id } = req.params;
    const attempts = await Attempt.find({ form_id });
    res.status(201).json({ attempts });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/create", async (req, res) => {
  try {
    const newAttempt = new Attempt(req.body);
    await newAttempt.save();
    return res.status(201).json({ message: "Attempt saved" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
