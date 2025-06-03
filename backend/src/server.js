const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Auth Routes for Users
app.use('/api/auth', require('./routes/auth.routes'));

// User Routes
app.use('/api/users', require('./routes/user.routes'));

// Client Routes
app.use('/api/clients', require('./routes/client.routes'));

//Sale Routes
app.use('/api/sales', require('./routes/sale.routes'));

// Note Routes
app.use('/api/notes', require('./routes/note.routes'));

// Reminder Routes
app.use('/api/reminders', require('./routes/reminder.routes'));




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
