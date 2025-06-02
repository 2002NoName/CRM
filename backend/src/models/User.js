const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true }, // User's name
  email: { type: String, unique: true, required: true }, // User's email, must be unique
  password: { type: String, required: true }, // User's password, required for authentication
  role: { type: String, enum: ['admin', 'manager', 'sales'], default: 'sales' } // User's role, can be 'admin', 'manager', or 'sales', default is 'sales'
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
