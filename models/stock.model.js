const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StockSchema = new Schema({
    username: {type:String, required: [true, 'Username is required']},
    stocks: [
        {
            stock : {type : String},
            amount: {type : Number}
        }
    ]
});

const Stock = mongoose.model('Stock', StockSchema);
module.exports = Stock;