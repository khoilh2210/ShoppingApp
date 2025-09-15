const Product = require("../models/Product");
const Inventory = require("../models/Inventory");

// Lấy danh sách sản phẩm
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("combos", "name price sku");
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy sản phẩm theo id
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("combos", "name price sku");
    if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Thêm sản phẩm + tạo inventory
exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();

    // tạo inventory mặc định
    const inventory = new Inventory({
      product: savedProduct._id,
      stock: req.body.stock || 0,
      location: req.body.location || "Default Warehouse"
    });
    await inventory.save();

    res.status(201).json({ product: savedProduct, inventory });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Cập nhật sản phẩm + tồn kho
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

    // nếu có trường stock thì cập nhật inventory
    if (req.body.stock !== undefined) {
      await Inventory.findOneAndUpdate(
        { product: req.params.id },
        { stock: req.body.stock, lastUpdated: Date.now() },
        { new: true, upsert: true }
      );
    }

    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Xóa sản phẩm + inventory
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

    await Inventory.findOneAndDelete({ product: req.params.id });

    res.json({ message: "Xóa sản phẩm và inventory thành công" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
