const Inventory = require("../models/Inventory");

// Lấy toàn bộ kho
exports.getInventory = async (req, res) => {
  try {
    const items = await Inventory.find().populate("product", "name sku price");
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy thông tin kho theo productId
exports.getInventoryByProduct = async (req, res) => {
  try {
    const item = await Inventory.findOne({ product: req.params.productId }).populate("product", "name sku price");
    if (!item) return res.status(404).json({ message: "Không tìm thấy sản phẩm trong kho" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Thêm mới hoặc cập nhật kho
exports.updateInventory = async (req, res) => {
  try {
    const { product, stock, location } = req.body;
    let item = await Inventory.findOne({ product });

    if (item) {
      item.stock = stock;
      item.location = location;
      item.lastUpdated = Date.now();
      await item.save();
    } else {
      item = new Inventory({ product, stock, location });
      await item.save();
    }

    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
