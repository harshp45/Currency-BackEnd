const { Convert } = require("easy-currencies");

module.exports = {
    async convertCurrency(base,to,price) {
        let value = await Convert(price)
          .from(base)
          .to(to);
      
        return value;
    }
}
