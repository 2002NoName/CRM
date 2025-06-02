const express = require('express');
const {
  getSales,
  createSale,
  getSaleById,
  updateSale,
  deleteSale
} = require('../controllers/sale.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();
router.use(protect);

router.route('/')
  .get(getSales)
  .post(createSale);

router.route('/:id')
  .get(getSaleById)
  .put(updateSale)
  .delete(deleteSale);

module.exports = router;
