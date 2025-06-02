const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const {
  createNote, getNotes, deleteNote
} = require('../controllers/note.controller');

router.use(protect);

router.route('/')
  .get(getNotes)
  .post(createNote);

router.route('/:id')
  .delete(deleteNote);

module.exports = router;
