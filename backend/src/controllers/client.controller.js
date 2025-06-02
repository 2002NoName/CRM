const Client = require('../models/Client');

// GET all clients (with role-based filtering)
exports.getClients = async (req, res) => {
  try {
    const query = req.user.role === 'sales' ? { owner: req.user.id } : {};
    const clients = await Client.find(query).populate('owner', 'name email');
    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST create client
exports.createClient = async (req, res) => {
  const { name, contactName, email, phone, status } = req.body;
  try {
    const client = await Client.create({
      name,
      contactName,
      email,
      phone,
      status,
      owner: req.user.id
    });
    res.status(201).json(client);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET single client
exports.getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client not found' });

    // Access control
    if (req.user.role === 'sales' && client.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(client);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT update client
exports.updateClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client not found' });

    if (req.user.role === 'sales' && client.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    Object.assign(client, req.body);
    await client.save();
    res.json(client);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE client
exports.deleteClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client not found' });

    if (req.user.role === 'sales' && client.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await client.remove();
    res.json({ message: 'Client removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
