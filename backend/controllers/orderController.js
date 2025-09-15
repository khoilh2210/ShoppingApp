const Order = require("../models/Order");
const Inventory = require("../models/Inventory");

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

// Tạo đơn hàng (có trừ tồn kho)
exports.createOrder = async (req, res) => {
  try {
    const { items, customerName, customerPhone, customerAddress, totalAmount } = req.body;

    // Trừ tồn kho như cũ...
    let updatedInventory = [];
    for (const item of items) {
      const inventoryItem = await Inventory.findOne({ product: item.product });
      if (!inventoryItem) {
        return res.status(404).json({ message: "Sản phẩm không tồn tại trong kho" });
      }
      if (inventoryItem.stock < item.quantity) {
        return res.status(400).json({ message: `Sản phẩm ${inventoryItem.product} không đủ hàng` });
      }
      inventoryItem.stock -= item.quantity;
      inventoryItem.lastUpdated = Date.now();
      await inventoryItem.save();
      updatedInventory.push(inventoryItem);
    }

    // ✅ Lưu order với các field khớp schema
    const order = new Order({
      user: req.user.id,
      customerName,
      customerPhone,
      customerAddress,
      items,
      totalAmount,
      status: "pending",
    });
    await order.save();

    res.status(201).json({
      message: "Tạo đơn hàng thành công",
      order,
      updatedInventory,
    });
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

// Lấy đơn hàng của user đang đăng nhập
// controllers/orderController.js
exports.getMyOrders = async (req, res) => {
  try {
    console.log(">>> getMyOrders - user:", req.user); // check có user chưa

    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    console.log(">>> orders found:", orders.length);

    res.json(orders);
  } catch (err) {
    console.error(">>> getMyOrders error:", err.message);
    res.status(500).json({ error: "Lỗi server khi lấy đơn hàng" });
  }
};


// module.exports = { getMyOrders };