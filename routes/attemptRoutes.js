// routes/attempt.js
const express = require("express");
const router = express.Router();
const Attempt = require("../models/attemptSchema");

router.get("/all", async (req, res) => {
  try {
    const attempts = await Attempt.find({});
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

// router.post("/create", async (req, res) => {
//   try {
//     const { form_id, answers, attempted_by_id } = req.body;

//     const form = await Form.findById(form_id);
//     if (!form) return res.status(404).json({ message: "Form not found" });

//     for (const question of form.questions) {
//       if (question.required) {
//         const answer = answers.find(
//           (a) => a.question_id === question._id.toString(),
//         );
//         if (!answer || !answer.answer || answer.answer.length === 0) {
//           return res.status(400).json({
//             message: `Question "${question.question_text}" is required.`,
//           });
//         }
//       }
//     }

//     const newAttempt = new Attempt({
//       form_id,
//       attempted_by_id,
//       answers,
//     });

//     await newAttempt.save();

//     return res.status(201).json({ message: "Attempt saved" });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Server error" });
//   }
// });

module.exports = router;
