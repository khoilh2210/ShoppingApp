const express = require("express");
const {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getMyOrders, // thêm vào đây
} = require("../controllers/orderController");
const Order = require("../models/Order");

const auth = require("../middleware/auth");

const { authMiddleware } = require("../controllers/auth.controller");

const router = express.Router();

router.get("/my-orders", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.product", "name price");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route cho customer (đặt trước)
// router.get("/my-orders", authMiddleware(["customer"]), getMyOrders);

// Routes cho admin/staff
router.get("/", getOrders);
router.get("/:id", getOrderById);
router.post("/", auth, createOrder); 
// router.post("/", createOrder);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);

// Route cho customer
router.get("/my-orders", authMiddleware(["customer"]), getMyOrders);
router.post("/", authMiddleware(["customer"]), createOrder);

module.exports = router;
