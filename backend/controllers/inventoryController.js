const Inventory = require("../models/Inventory");
const Product = require("../models/Product");

// Lấy danh sách kho
exports.getInventory = async (req, res) => {
  try {
    const inventories = await Inventory.find().populate("product");
    res.json(inventories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Tạo sản phẩm + kho
exports.createInventory = async (req, res) => {
  try {
    const { name, description, images, video, price, costPrice, sku, category, variants, combos, stock, location } = req.body;

    // 1. Tạo product
    const product = new Product({ name, description, images, video, price, costPrice, sku, category, variants, combos });
    await product.save();

    // 2. Tạo inventory
    const inventory = new Inventory({ product: product._id, stock, location });
    await inventory.save();

    await inventory.populate("product");
    res.status(201).json(inventory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Sửa sản phẩm + kho
exports.updateInventory = async (req, res) => {
  try {
    const { id } = req.params; // id của inventory
    const { name, description, images, video, price, costPrice, sku, category, variants, combos, stock, location } = req.body;

    const inventory = await Inventory.findById(id).populate("product");
    if (!inventory) return res.status(404).json({ message: "Không tìm thấy kho" });

    // update product
    const product = await Product.findById(inventory.product._id);
    if (product) {
      product.name = name ?? product.name;
      product.description = description ?? product.description;
      product.images = images ?? product.images;
      product.video = video ?? product.video;
      product.price = price ?? product.price;
      product.costPrice = costPrice ?? product.costPrice;
      product.sku = sku ?? product.sku;
      product.category = category ?? product.category;
      product.variants = variants ?? product.variants;
      product.combos = combos ?? product.combos;
      await product.save();
    }

    // update inventory
    if (stock !== undefined) inventory.stock = stock;
    if (location) inventory.location = location;
    inventory.lastUpdated = Date.now();
    await inventory.save();

    await inventory.populate("product");
    res.json(inventory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Xóa sản phẩm + kho
exports.deleteInventory = async (req, res) => {
  try {
    const inventory = await Inventory.findById(req.params.id);
    if (!inventory) return res.status(404).json({ message: "Không tìm thấy trong kho" });

    await Product.findByIdAndDelete(inventory.product); // xóa product
    await inventory.deleteOne(); // xóa inventory

    res.json({ message: "Xóa thành công cả sản phẩm và kho" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
