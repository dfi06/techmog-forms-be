// routes/attempt.js
const express = require("express");
const router = express.Router();
const Attempt = require("../models/attemptSchema");
const authMiddleware = require("../middleware/middleware");

/**
 * @swagger
 * tags:
 *   name: Attempts
 *   description: Form attempt submissions
 */

/**
 * @swagger
 * /attempt/all:
 *   get:
 *     tags: [Attempts]
 *     summary: List all attempts (auth required)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of attempts
 */
router.get("/all", authMiddleware, async (req, res) => {
  try {
    const attempts = await Attempt.find({});
    res.status(201).json({ attempts });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * @swagger
 * /attempt/by/{form_id}:
 *   get:
 *     tags: [Attempts]
 *     summary: List attempts for a form
 *     parameters:
 *       - in: path
 *         name: form_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Attempts for the form
 */
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

/**
 * @swagger
 * /attempt/create:
 *   post:
 *     tags: [Attempts]
 *     summary: Create a new attempt
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AttemptCreate'
 *     responses:
 *       201:
 *         description: Attempt saved
 */
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
