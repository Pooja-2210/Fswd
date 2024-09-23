const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    password: String,
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const User = mongoose.model('User', userSchema);
module.exports = User;