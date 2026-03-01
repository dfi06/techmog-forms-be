const mongoose = require("mongoose");
const attemptSchema = new mongoose.Schema(
  {
    attempted_by_id: mongoose.Schema.Types.ObjectId,
    form_id: mongoose.Schema.Types.ObjectId,
    answers: [
      {
        question_id: mongoose.Schema.Types.ObjectId,
        answer: [String],
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Attempt", attemptSchema);
