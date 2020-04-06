const mongoose = require('mongoose');


const RatesSchema = new mongoose.Schema({      
        base: {type: String},
        date: {type: String},
        rates: 
        [{
                EUR: Number,
                CAD: Number,
                HKD: Number,
                ISK: Number,
                PHP: Number,
                DKK: Number,
                HUF: Number,
                CZK: Number,
                GBP: Number,
                RON: Number,
                SEK: Number,
                IDR: Number,
                INR: Number,
                BRL: Number,
                USD: Number,
                MXN: Number,
                SGD: Number,
                AUD: Number,
                ILS: Number,
                KRW: Number,
                PLN: Number
        }]
});

const Rate = mongoose.model('currency_rates', RatesSchema);

module.exports = Rate;