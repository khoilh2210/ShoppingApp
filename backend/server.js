require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); // 👈 import db.js

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Kết nối MongoDB
connectDB();

// Routes
app.get('/', (req, res) => {
  res.send('API Running...');
});

app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/inventory", require("./routes/inventoryRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
