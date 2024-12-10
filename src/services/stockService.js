// File: src/services/stockService.js
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 300 }); // Cache for 5 minutes

class StockService {
  async getStockPrice(symbol) {
    
    const cachedPrice = cache.get(symbol);
    if (cachedPrice) return cachedPrice;
    const mockPrice = Math.random() * 1000;
    cache.set(symbol, mockPrice);
    return mockPrice;
  }

  async getStockHistory(symbol, days = 30) {

    const history = [];
    for (let i = 0; i < days; i++) {
      history.push({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
        price: Math.random() * 1000
      });
    }
    return history;
  }
}

module.exports = new StockService();
