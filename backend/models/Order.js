const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  variant: {
    color: String,
    size: String,
  },
  quantity: Number,
  price: Number
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  customerName: String,
  customerPhone: String,
  customerAddress: String,
  items: [orderItemSchema],
  totalAmount: Number,
  status: { type: String, default: "pending" } // pending, paid, shipped...
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
