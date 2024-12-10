const Portfolio = require('../models/Portfolio');
const Transaction = require('../models/Transaction');
const stockService = require('../services/stockService');

class PortfolioController {
  async addStock(req, res) {
    try {
      const { userId, symbol, shares, price } = req.body;
      
      let portfolio = await Portfolio.findOne({ userId });
      if (!portfolio) {
        portfolio = new Portfolio({ userId, holdings: [] });
      }

      const existingHolding = portfolio.holdings.find(h => h.symbol === symbol);
      if (existingHolding) {
        const totalShares = existingHolding.shares + shares;
        const totalCost = (existingHolding.shares * existingHolding.averageCost) + (shares * price);
        existingHolding.averageCost = totalCost / totalShares;
        existingHolding.shares = totalShares;
      } else {
        portfolio.holdings.push({
          symbol,
          shares,
          averageCost: price
        });
      }

      await portfolio.save();
      
      // Record transaction
      await Transaction.create({
        userId,
        symbol,
        type: 'BUY',
        shares,
        price
      });

      res.json(portfolio);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async removeStock(req, res) {
    try {
      const { userId, symbol, shares, price } = req.body;
      
      const portfolio = await Portfolio.findOne({ userId });
      if (!portfolio) {
        return res.status(404).json({ error: 'Portfolio not found' });
      }

      const holding = portfolio.holdings.find(h => h.symbol === symbol);
      if (!holding || holding.shares < shares) {
        return res.status(400).json({ error: 'Insufficient shares' });
      }

      holding.shares -= shares;
      if (holding.shares === 0) {
        portfolio.holdings = portfolio.holdings.filter(h => h.symbol !== symbol);
      }

      await portfolio.save();
      
      // Record transaction
      await Transaction.create({
        userId,
        symbol,
        type: 'SELL',
        shares,
        price
      });

      res.json(portfolio);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getPortfolioValue(req, res) {
    try {
      const { userId } = req.params;
      
      const portfolio = await Portfolio.findOne({ userId });
      if (!portfolio) {
        return res.status(404).json({ error: 'Portfolio not found' });
      }

      let totalValue = 0;
      for (const holding of portfolio.holdings) {
        const currentPrice = await stockService.getStockPrice(holding.symbol);
        totalValue += currentPrice * holding.shares;
      }

      res.json({ totalValue });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async listHoldings(req, res) {
    try {
      const { userId } = req.params;
      
      const portfolio = await Portfolio.findOne({ userId });
      if (!portfolio) {
        return res.status(404).json({ error: 'Portfolio not found' });
      }

      const holdingsWithCurrentPrice = await Promise.all(
        portfolio.holdings.map(async holding => {
          const currentPrice = await stockService.getStockPrice(holding.symbol);
          return {
            ...holding.toObject(),
            currentPrice,
            currentValue: currentPrice * holding.shares,
            gainLoss: (currentPrice - holding.averageCost) * holding.shares
          };
        })
      );

      res.json(holdingsWithCurrentPrice);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new PortfolioController();