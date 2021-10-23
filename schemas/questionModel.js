const mongoose = require('mongoose');

// Schema with constraints will work when inserting into the DB
// However if validation is required when updating, then set {runValidators: true}

const questionSchema = new mongoose.Schema({
    // Link the ID to the ID of the quiz
    quizId:
    {
        type: mongoose.Schema.ObjectId,
        ref: 'quizModel',
        required: true
    },
    question:
    {
        type: String,
        required: true
    },
    optionA:
    {
        type: String,
        required: true
    },
    optionB:
    {
        type: String,
        required: true
    },
    optionC:
    {
        type: String,
        required: true
    },
    optionD:
    {
        type: String,
        required: true
    },
    correctAnswer:
    {
        type: String,
        required: true
    },
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;