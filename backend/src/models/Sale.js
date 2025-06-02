const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Title of the sale
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true }, // Reference to the client associated with the sale
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Seller or user who owns this sale
  value: { type: Number, default: 0 }, // Value of the sale
  status: {                                            // Status of the sale
    type: String,
    enum: ['lead', 'contacted', 'negotiation', 'won', 'lost'],
    default: 'lead'
  }, 
  notes: { type: String } // Additional notes about the sale
}, { timestamps: true });

module.exports = mongoose.model('Sale', saleSchema);
