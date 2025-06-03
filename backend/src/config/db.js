const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log(`MongoDB connected successfully at URI "${process.env.MONGO_URI}"`);
  } catch (err) {
    console.error(`MongoDB connection failed at URI "${process.env.MONGO_URI}":`, err.message);
    throw new Error('Failed to connect to MongoDB');
  }
};

module.exports = connectDB;
