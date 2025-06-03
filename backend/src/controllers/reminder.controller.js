const Reminder = require('../models/Reminder');

//POST create reminder
exports.createReminder = async (req, res) => {
  const { title, dueDate, relatedTo } = req.body;
  try {
    const reminder = await Reminder.create({
      title,
      dueDate,
      relatedTo,
      owner: req.user.id
    });
    res.status(201).json(reminder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//GET all reminders for the logged-in user
exports.getReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find({ owner: req.user.id }).sort('dueDate');
    res.json(reminders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


//PUT mark reminder as done
exports.markDone = async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.id);
    if (!reminder || reminder.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    reminder.isDone = true;
    await reminder.save();
    res.json(reminder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


//DELETE a reminder by ID
exports.deleteReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.id);
    if (!reminder || reminder.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    await reminder.deleteOne();
    res.json({ message: 'Reminder deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
