const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const {
  createReminder, getReminders, markDone, deleteReminder
} = require('../controllers/reminder.controller');

router.use(protect);

router.route('/')
  .get(getReminders)
  .post(createReminder);

router.route('/:id')
  .patch(markDone)
  .delete(deleteReminder);

module.exports = router;
