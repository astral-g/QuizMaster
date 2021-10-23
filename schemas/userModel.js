const mongoose = require('mongoose');

// Schema with constraints will work when inserting into the DB
// However if validation is required when updating, then set {runValidators: true}

const userSchema = new mongoose.Schema({
    userName: 
    {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    permission: 
    {
        type: String,
        required: true
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;