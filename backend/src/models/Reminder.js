const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Title of the reminder
  dueDate: { type: Date, required: true }, // Due date for the reminder
  isDone: { type: Boolean, default: false }, // Status of the reminder (done or not)
  relatedTo: {
    kind: { type: String, enum: ['Client', 'Sale'], required: true }, // Type of related item (Client or Sale)
    item: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'relatedTo.kind' } // Reference to the related item (Client or Sale)
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // User who created the reminder
}, { timestamps: true });

module.exports = mongoose.model('Reminder', reminderSchema);
