const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CurrencySchema = new Schema({
    username: {type:String, required: [true, 'Username is required']},
    currencies: [
        {
            currency : {type : String},
            amount: {type : Number}
        }
    ]
});

const Currency = mongoose.model('Currency', CurrencySchema);
module.exports = Currency;
