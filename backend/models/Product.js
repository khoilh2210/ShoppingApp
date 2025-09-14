const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema({
  color: String,
  size: String,
  price: Number,
  stock: Number
});

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  images: [String],
  video: String,
  price: Number,
  costPrice: Number,
  sku: String,
  category: String,
  variants: [variantSchema],
  combos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }]
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);

