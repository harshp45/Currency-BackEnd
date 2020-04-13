const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StockRatesSchema = new Schema({
    stocks: [
        {
            AAPL: Number,
            AMZN: Number,
            MSFT: Number,
            GOOGL: Number,
            FB: Number,
            TCS: Number,
            TSLA: Number
        }
    ]
});

const StockRates = mongoose.model('stock_rates', StockRatesSchema);
module.exports = StockRates;