// backend/models/savingsModel.js
const mongoose = require('mongoose');

const savingsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['Siddhant', 'Sanika'] // Restrict to just two names
  },
  amount: {
    type: Number,
    required: true,
    // ✅ Allow both positive and negative values
  },

  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Savings', savingsSchema);

// gcFNFKwdrLonMm26