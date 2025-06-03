const Sale = require('../models/Sale');


//GET all sales for the logged-in user or all sales if admin
exports.getSales = async (req, res) => {
  try {
    const filter = req.user.role === 'sales' ? { owner: req.user.id } : {};
    const sales = await Sale.find(filter).populate('client owner', 'name email');
    res.json(sales);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


//POST create a new sale
exports.createSale = async (req, res) => {
  const { title, client, value, status, notes } = req.body;
  try {
    const sale = await Sale.create({
      title,
      client,
      value,
      status,
      notes,
      owner: req.user.id
    });
    res.status(201).json(sale);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//GET a single sale by ID
exports.getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) return res.status(404).json({ message: 'Sale not found' });

    if (req.user.role === 'sales' && sale.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(sale);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//PUT update a sale by ID
exports.updateSale = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) return res.status(404).json({ message: 'Sale not found' });

    if (req.user.role === 'sales' && sale.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    Object.assign(sale, req.body);
    await sale.save();
    res.json(sale);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


//DELETE a sale by ID
exports.deleteSale = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) return res.status(404).json({ message: 'Sale not found' });

    if (req.user.role === 'sales' && sale.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await sale.deleteOne();
    res.json({ message: 'Sale removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
