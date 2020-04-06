const express = require('express');
const router = express.Router();
//const currency = require('./../controllers/currency/index');
const exchangeRateProvider = require('../../controllers/currency/exchange-rate-provider');
const Currency = require('../../models/currency.model');
const Transaction = require('../../models/transaction.model');

//exchangeRateProvider.convertCurrency("USD","INR",1).then((value)=>console.log(value));
var value1;

router.route('/calculate').post(async (req, res) => {
    try {
        const base = req.body.selling_currency;
        const to = req.body.buying_currency;
        // console.log('hi'+currObj);
        // let base = req.params.selling_currency;
        // let to = 'INR'
        // let price = 1;
        // console.log("In calculate post" + base, to);
        value1 = await exchangeRateProvider.convertCurrency(base, to, 1);
        console.log(value1);
        res.json(value1);
    }
    catch (e) {
        res.send(e)
    }

    //console.log("hiiiii");
})

router.route('/').get(async (req, res) => {
    Currency.findById('5e6c34705af7aa297ce3d987')
        .then((results) => res.send(results))
        .catch((e) => res.status(400).json(e))
})

router.route('/getall').get(async (req,res)=>{
    try {
        Transaction.find().then((results)=>res.json(results));
    } catch (e) {
        
    }
})

router.route('/buy-sell').post(async (req, res) => {

    try {
        console.log("Inside buy");
        //console.log(value1);
        let username = req.body.username;

        let sell_currency = req.body.sell_currency;
        let sell_amount = req.body.sell_amount;

        const newSoldTrans = new Transaction({
            username: username,
            currency: sell_currency,
            amount: sell_amount,
            status: "Sold"
        })

        await newSoldTrans.save();

        // res.json('Transaction Added!');


        let buy_currency = req.body.buy_currency;
        let buy_amount = req.body.sell_amount*value1;

        const newBuyTrans = new Transaction({
            username: username,
            currency: buy_currency,
            amount: buy_amount,
            status: "Bought"
        })

        await newBuyTrans.save();

        // res.json('Transaction Added!');

        let newCurrency = { currency: buy_currency, amount: buy_amount };
        //console.log(username);
        const user = await Currency.findOne({ 'username': username });

        for (let i = 0; i < user.currencies.length; i++) {
            const element = user.currencies[i];
            if (element.currency === sell_currency) {
                user.currencies[i].amount -= sell_amount;
            }
        }

        await Currency.findOneAndUpdate({ 'username': username }, { $push: { currencies: newCurrency } }, { useFindAndModify: false });
        await user.save();


        res.json('Trans done');
    } catch (e) {
        res.json('Error in trans');
    }



})


module.exports = router;