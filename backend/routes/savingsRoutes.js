const express = require('express');
const router = express.Router();
const {
  saveAmount,
  getTotal,
  getHistory,
} = require('../controllers/savingsController');

// ✅ Define routes
router.post('/save', saveAmount);
router.get('/total', getTotal);
router.get('/history', getHistory);

module.exports = router;
