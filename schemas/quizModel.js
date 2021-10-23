const mongoose = require('mongoose');

// Schema with constraints will work when inserting into the DB
// However if validation is required when updating, then set {runValidators: true}

const quizSchema = new mongoose.Schema({
    name: 
    {
        type: String,
        required: true,
        unique: true
    },
    description: 
    {
        type: String,
        required: true
    }
});

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;