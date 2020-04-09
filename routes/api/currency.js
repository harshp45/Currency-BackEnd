var http = require("https");
const express = require('express');
const app = express();
const auth = require('../../middleware/auth');
const rateslist = require('../../models/Rates');
const router = express.Router();

// var basecurrency = "CAD";
// var apiURL = "https://api.exchangeratesapi.io/latest?base="+basecurrency+"&HTTP/1.1";

router.get('/base', (req,res) => 
{
    var basecurrency = req.body.base;
    var apiURL = "https://api.exchangeratesapi.io/latest?base="+basecurrency+"&HTTP/1.1";

    res.send("Base Currency Set");
    console.log(apiURL)

    //fetching live currency rates through API
    http.get(apiURL, function (res) 
    {
        var body = "";
        res.on('data', function (data) {
            body += data;
            //console.log("Data: "+body);
        });

        //Fetching Rates
        router.get('/list', auth, async (req, res) => 
        {
            try {
                const RateDb = await rateslist.findOne();
                //const inr = RateDb.rates[0].INR;
                //console.log(JSON.stringify(inr));
                res.send(RateDb);
            }
            catch (err) {
                res.status(500).send('Server Error');
            }
        });

        //Adding the currency rates into MongoDB just for reference
        router.post('/add', auth, async (req, res) => 
        {
            try 
            {
                var rateResponse = JSON.parse(body);
                const newrate = new rateslist({

                    base: rateResponse.base,
                    date: rateResponse.date,
                    rates:
                        [{
                            EUR: rateResponse.rates.EUR,
                            CAD: rateResponse.rates.CAD,
                            HKD: rateResponse.rates.HKD,
                            ISK: rateResponse.rates.ISK,
                            PHP: rateResponse.rates.PHP,
                            DKK: rateResponse.rates.DKK,
                            HUF: rateResponse.rates.HUF,
                            CZK: rateResponse.rates.CZK,
                            GBP: rateResponse.rates.GBP,
                            RON: rateResponse.rates.RON,
                            SEK: rateResponse.rates.SEK,
                            IDR: rateResponse.rates.IDR,
                            INR: rateResponse.rates.INR,
                            BRL: rateResponse.rates.BRL,
                            USD: rateResponse.rates.USD,
                            MXN: rateResponse.rates.MXN,
                            SGD: rateResponse.rates.SGD,
                            AUD: rateResponse.rates.AUD,
                            ILS: rateResponse.rates.ILS,
                            KRW: rateResponse.rates.KRW,
                            PLN: rateResponse.rates.PLN
                        }]
                });

                const nRate = await newrate.save();
                res.json(nRate);
                res.end();
            }
            catch (err) {
                res.status(500).send('Server Error');
            }
        });

        //Updating the currency rates into MongoDB to get updated rates on React App
        router.put('/update', auth, async (req, res) => 
        {
            try {
                var rateResponse = JSON.parse(body);
                const newrate = await rateslist.findById("5e8b61c568a5df3a8414cbdc");

                newrate.base = rateResponse.base,
                    newrate.date = rateResponse.date,
                    newrate.rates =
                    [{
                        EUR: rateResponse.rates.EUR,
                        CAD: rateResponse.rates.CAD,
                        HKD: rateResponse.rates.HKD,
                        ISK: rateResponse.rates.ISK,
                        PHP: rateResponse.rates.PHP,
                        DKK: rateResponse.rates.DKK,
                        HUF: rateResponse.rates.HUF,
                        CZK: rateResponse.rates.CZK,
                        GBP: rateResponse.rates.GBP,
                        RON: rateResponse.rates.RON,
                        SEK: rateResponse.rates.SEK,
                        IDR: rateResponse.rates.IDR,
                        INR: rateResponse.rates.INR,
                        BRL: rateResponse.rates.BRL,
                        USD: rateResponse.rates.USD,
                        MXN: rateResponse.rates.MXN,
                        SGD: rateResponse.rates.SGD,
                        AUD: rateResponse.rates.AUD,
                        ILS: rateResponse.rates.ILS,
                        KRW: rateResponse.rates.KRW,
                        PLN: rateResponse.rates.PLN
                    }]

                const nRate = await newrate.save();
                res.json(nRate);
                res.end();
            }
            catch (err) {
                res.status(500).send('Server Error');
            }
        });
    });
});
module.exports = router;