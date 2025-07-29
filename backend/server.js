const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const savingsRoutes = require('./routes/savingsRoutes');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Route must be a valid function (router)
//comment
app.use('/api', savingsRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(5000, () => console.log('Server running on port 5000'));
    console.log('MongoDB connected');
  })
  .catch(err => console.error('MongoDB connection error:', err));
