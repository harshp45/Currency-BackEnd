const mongoose = require('mongoose');


const TokenSchema = new mongoose.Schema({

    token: { type: String, required: true},

});

const Token = mongoose.model('tokens', TokenSchema);

module.exports = Token