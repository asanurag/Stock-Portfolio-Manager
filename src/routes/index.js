const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');
const transactionController = require('../controllers/transactionController');
const auth = require('../middleware/auth');
const authRoutes = require('./auth');
router.use('/auth', authRoutes);

// Portfolio routes
router.post('/portfolio/stock', auth, portfolioController.addStock);
router.delete('/portfolio/stock', auth, portfolioController.removeStock);
router.get('/portfolio/value/:userId', auth, portfolioController.getPortfolioValue);
router.get('/portfolio/holdings/:userId', auth, portfolioController.listHoldings);

// Transaction routes
router.get('/transactions/:userId', auth, transactionController.getTransactionHistory);

module.exports = router;