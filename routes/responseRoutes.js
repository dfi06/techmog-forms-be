const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const authMiddleware = require("../middleware/middleware.js");

const Attempt = require("../models/attemptSchema");
const Form = require("../models/formSchema");

/**
 * @swagger
 * tags:
 *   name: Responses
 *   description: Aggregated response stats for a form
 */

/**
 * @swagger
 * /response/get/{form_id}:
 *   get:
 *     tags: [Responses]
 *     summary: Get aggregated response statistics for a form
 *     parameters:
 *       - in: path
 *         name: form_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Aggregated response data
 */
router.get("/get/:form_id", async (req, res) => {
  try {
    const { form_id } = req.params;
    const attempts = await Attempt.find({ form_id });
    const form = await Form.findById(form_id);

    const total_responses = attempts.length;

    const uniqueUsers = new Set(
      attempts.map((a) => a.attempted_by_id?.toString()),
    );

    const total_unique_users = uniqueUsers.size;

    const questionMap = {};

    for (const question of form.questions) {
      questionMap[question._id.toString()] = {
        question_id: question._id,
        question_text: question.question_text,
        answers: {},
      };

      if (question.options) {
        for (const opt of question.options) {
          questionMap[question._id.toString()].answers[opt] = 0;
        }
      }
    }

    for (const attempt of attempts) {
      for (const ans of attempt.answers) {
        const qid = ans.question_id.toString();
        const question = questionMap[qid];
        if (!question) continue;

        for (const value of ans.answer) {
          question.answers[value] = (question.answers[value] || 0) + 1;
        }
      }
    }

    res.json({
      form_id: form._id,
      owner_id: form.owner_id,
      title: form.title,
      total_responses,
      total_unique_users,
      questions: Object.values(questionMap),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
