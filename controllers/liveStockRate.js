const fmp = require('financialmodelingprep')

const router = {
    async getLiveStockRate(stockName) {
        const data = await fmp.stock(stockName).quote();    
        return data;
    }
};
module.exports = router