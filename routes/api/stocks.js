const express = require('express');
const router = express.Router();
const Stock = require('../../models/stock.model');
const StockTransaction = require('../../models/stockTransaction.model');
const liveStockRate = require('../../controllers/stock/liveStockRate');

router.route('/').get(async (req, res) => {
    await Stock.findById('5e8a4b2c1c9d4400001f5dcf')
         .then((result) => res.send(result));
       
})

router.route('/getRates').post(async (req,res)=>{
    // console.log(req.body.selling_code);
    let data =  await liveStockRate.getLiveStockRate(req.body.code);
    res.json(data[0].price);

})

router.route('/sellStock').post(async (req,res)=>{
    let selling_stock = req.body.selling_stock
    let selling_amount = req.body.selling_amount
    let username = req.body.username
    const trans = new StockTransaction({
        username : username,
        stock:selling_stock,
        amount:selling_amount,
        status:'sell'
    })

    await trans.save();

    res.json('Trans complete');


    const user = await Stock.findOne({'username':username});

    for(let i = 0;i<user.stocks.length;i++){
        const item = user.stocks[i]
        if(item.stock===selling_stock){
            user.stocks[i].amount -= selling_amount; 
        }
    }
    await user.save();
})

router.route('/buyStock').post(async (req,res)=>{
    let buying_stock = req.body.buying_stock
    let buying_amount = req.body.buying_amount
    let username = req.body.username
    const trans = new StockTransaction({
        username : username,
        stock:buying_stock,
        amount:buying_amount,
        status:'buy'
    })

    await trans.save();
    res.json('Trans complete');


    let newStock = { stock: buying_stock, amount: buying_amount };
    await Stock.findOneAndUpdate({ 'username': username }, { $push: { stocks: newStock} }, { useFindAndModify: false });
})

router.route('/getall').get(async (req,res)=>{
    try {
        StockTransaction.find().then((results)=>res.json(results));
    } catch (e) {
        
    }
})
module.exports = router;