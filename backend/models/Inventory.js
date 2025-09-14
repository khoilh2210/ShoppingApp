const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  stock: { type: Number, default: 0 },
  location: String,
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Inventory", inventorySchema);
