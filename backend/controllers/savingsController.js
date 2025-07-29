const Savings = require('../models/Savings');

// Save entry (can be positive or negative)
const saveAmount = async (req, res) => {
  try {
    const { name, amount } = req.body;

    console.log('🟢 Received from frontend:', { name, amount }); // ← log incoming data

    if (!name || isNaN(amount)) {
      return res.status(400).json({ message: 'Invalid name or amount' });
    }

    const entry = new Savings({
      name,
      amount: Number(amount),
      date: new Date(),
    });

    await entry.save();
    res.status(201).json(entry);
  } catch (err) {
    console.error('🔴 Error in saveAmount:', err); // ← log full error
    res.status(500).json({ message: 'Server error' });
  }
};


const getTotal = async (req, res) => {
  try {
    const all = await Savings.find();
    const total = all.reduce((sum, entry) => sum + entry.amount, 0);
    const message = total >= 1300 ? '🎉 Target Reached!' : '';
    res.json({ total, message });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getHistory = async (req, res) => {
  try {
    const history = await Savings.find().sort({ date: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ EXPORT ALL FUNCTIONS CORRECTLY
module.exports = {
  saveAmount,
  getTotal,
  getHistory,
};
