const express = require('express');
const router = express.Router();
//const currency = require('./../controllers/currency/index');
const exchangeRateProvider = require('../../controllers/currency/exchange-rate-provider');
const Currency = require('../../models/currency.model');
const Transaction = require('../../models/transaction.model');
const tokenModel = require('../../models/token');
const jwt = require('jsonwebtoken');
const config = require('config');

//exchangeRateProvider.convertCurrency("USD","INR",1).then((value)=>console.log(value));
var value1;

router.route('/calculate').post(async (req, res) => {
    try {
        const base = req.body.selling_currency;
        const to = req.body.buying_currency;
        value1 = await exchangeRateProvider.convertCurrency(base, to, 1);
        let amt = 0;

        //Getting Token
        const tokenDb = await tokenModel.findOne();
        token = tokenDb.token;
        //Decoding Token
        const decoded = jwt.verify(token, config.get('jwtsecret'));
        var username = decoded.user.username;

        await Currency.findOne({ 'username': username })
            .then((results) => {
                for (let i = 0; i < results.currencies.length; i++) {
                    const element = results.currencies[i];
                    if (element.currency === base) {
                        //console.log(element)
                        //console.log(element.amount)
                        amt = amt + element.amount
                    }
                }
                let newobj = {
                    rate: value1,
                    amount: amt
                }

                console.log('New Obj' + newobj.amount);
                res.send(newobj);
            })
    }
    catch (e) {
        res.send(e)
    }

    //console.log("hiiiii");
})

router.route('/').get(async (req, res) => {
    //Getting Token
    const tokenDb = await tokenModel.findOne();
    token = tokenDb.token;
    //Decoding Token
    const decoded = jwt.verify(token, config.get('jwtsecret'));
    var username = decoded.user.username;
    console.log(username)
    await Currency.findOne({ 'username':  username})
        .then((results) => {
            //console.log('hi'+results.currencies)
            let newObj = {
                currencies: ['INR', 'CAD', 'USD'],
                username: results.username
            }

            //console.log(newObj);
            res.send(newObj)
        })
        .catch((e) => res.status(400).json(e))
})

router.route('/getall').get(async (req, res) => {
    try {
        Transaction.find().then((results) => {
            res.send(results)
        });
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
        let buy_amount = req.body.sell_amount * value1;

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

        //Getting Token
        const tokenDb = await tokenModel.findOne();
        token = tokenDb.token;
        //Decoding Token
        const decoded = jwt.verify(token, config.get('jwtsecret'));
        var username1 = decoded.user.username;

        const user = await Currency.findOne({ 'username': username1 })

        for (let i = 0; i < user.currencies.length; i++) {
            const element = user.currencies[i];
            if (element.currency === sell_currency) {
                user.currencies[i].amount -= sell_amount;
                break;
            }

        }

        await Currency.findOneAndUpdate({ 'username': username1 }, { $push: { currencies: newCurrency } }, { useFindAndModify: false });
        await user.save();


        res.send('Trans done');
    } catch (e) {
        console.log(e)
        res.json('Error in trans');
    }



})


module.exports = router;