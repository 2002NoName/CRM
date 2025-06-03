const Note = require('../models/Note');

//POST create note
exports.createNote = async (req, res) => {
  const { content, relatedTo } = req.body;
  try {
    const note = await Note.create({
      content,
      relatedTo,
      owner: req.user.id
    });
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//GET all notes for the logged-in user
exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ owner: req.user.id }).sort('-createdAt');
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//DELETE a note by ID
exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note || note.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    await note.deleteOne();
    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
