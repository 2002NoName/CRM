const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  content: { type: String, required: true }, // Note content
  relatedTo: {
    kind: { type: String, enum: ['Client', 'Sale'], required: true }, // Type of related item (Client or Sale)
    item: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'relatedTo.kind' } // Reference to the related item (Client or Sale)
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // User who created the note
}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);
