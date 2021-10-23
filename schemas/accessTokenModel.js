const mongoose = require('mongoose');

const accessTokenSchema = new mongoose.Schema({
    userId: 
    {
        type: mongoose.Schema.ObjectId,
        ref: 'userModel',
        required: true
    },
    token:
    {
        type: String,
        required: true,
        unique: true 
    }
});

const Token = mongoose.model('Tokens', accessTokenSchema);

module.exports = Token;