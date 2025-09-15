// controllers/inventoryController.js
const Product = require("../models/Product");
const express = require("express");
const router = express.Router();
// const { getInventory } = require("../controllers/inventoryController");


const {
  getInventory,
  createInventory,
  updateInventory,
  deleteInventory
} = require("../controllers/inventoryController");

router.get("/", getInventory);
router.post("/", createInventory);
router.put("/:id", updateInventory);
router.delete("/:id", deleteInventory);



exports.getInventory = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getInventoryByProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Chỉ admin mới được cập nhật
exports.updateInventory = async (req, res) => {
  try {
    const { productId, variantId, stock } = req.body;

    const product = await Product.findOneAndUpdate(
      { _id: productId, "variants._id": variantId },
      { $set: { "variants.$.stock": stock } },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm hoặc variant" });
    }

    // tìm lại variant vừa update
    const updatedVariant = product.variants.id(variantId);

    res.json({
      message: "Cập nhật tồn kho thành công",
      productId: product._id,
      variant: updatedVariant
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = router;
