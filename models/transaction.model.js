const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
    username: {type:String, required: [true, 'Username is required']},
    currency: {type:String, required: [true,'Currency code is required']},
    amount: {type: Number},
    status:{type:String}
});

const Transaction = mongoose.model('Transaction', TransactionSchema);
module.exports = Transaction;
