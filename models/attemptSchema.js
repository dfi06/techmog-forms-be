const mongoose = require('mongoose')
const attemptSchema = new mongoose.Schema({
    submitted_by_id: mongoose.Schema.Types.ObjectId,
    form_id: mongoose.Schema.Types.ObjectId,
    answers: [
        {
            question_id: mongoose.Schema.Types.ObjectId,
            answer: String
        }
    ],
    
}, { timestamps: true })

module.exports = attemptSchema