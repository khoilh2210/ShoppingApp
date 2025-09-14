const Order = require("../models/Order");

// Lấy danh sách đơn hàng
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("items.product", "name sku price");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy đơn hàng theo id
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.product", "name sku price");
    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Tạo đơn hàng
exports.createOrder = async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Cập nhật trạng thái đơn hàng
exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Xóa đơn hàng
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    res.json({ message: "Xóa đơn hàng thành công" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
