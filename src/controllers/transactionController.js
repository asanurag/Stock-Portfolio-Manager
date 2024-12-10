const Transaction = require('../models/Transaction');

class TransactionController {
  async getTransactionHistory(req, res) {
    try {
      const { userId } = req.params;
      const transactions = await Transaction.find({ userId })
        .sort({ date: -1 })
        .limit(100);
      
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new TransactionController();