const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StockTransactionSchema = new Schema({
    username: {type:String, required: [true, 'Username is required']},
    stock: {type:String, required: [true,'Stock code is required']},
    amount: {type: Number},
    status:{type:String}
});

const StockTransaction = mongoose.model('StockTransaction', StockTransactionSchema);
module.exports = StockTransaction;