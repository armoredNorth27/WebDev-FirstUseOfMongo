
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UserSchema = Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    privacy: { 
        type: Boolean,
        required: true,
    }
});

module.exports = mongoose.model('users', UserSchema);