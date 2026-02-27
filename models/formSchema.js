const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({ 
    type: {type: String, enum: ["Multiple Choice", "Short Answer", "Checkbox", "Dropdown"]},
    options:[String], 
    required: Boolean, 
    question_text: String
})

const form = new mongoose.Schema({
    title: String,
    description: String,
    owner_id: mongoose.Schema.Types.ObjectId,
    owner_username: String
})