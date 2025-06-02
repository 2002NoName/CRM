const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },                  //Company name
  contactName: { type: String },                           //Contact person name
  email: { type: String },                                 //Contact email
  phone: { type: String },                                //Contact phone number
  status: { type: String, enum: ['new', 'contacted', 'negotiation', 'won', 'lost'], default: 'new' }, // Status of the client
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } //Seller or user who owns this client
}, { timestamps: true });

module.exports = mongoose.model('Client', clientSchema);
