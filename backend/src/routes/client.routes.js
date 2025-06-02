const express = require('express');
const {
  getClients,
  createClient,
  getClientById,
  updateClient,
  deleteClient
} = require('../controllers/client.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect); // Protect all routes in this file

router.route('/')
  .get(getClients)
  .post(createClient);

router.route('/:id')
  .get(getClientById)
  .put(updateClient)
  .delete(deleteClient);

module.exports = router;
