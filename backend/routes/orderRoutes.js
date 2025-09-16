const express = require("express");
const {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getMyOrders,
  getRevenueStats,
} = require("../controllers/orderController");

const auth = require("../middleware/auth"); // middleware kiểm tra token và gán req.user

const router = express.Router();

/**
 * =========================
 * Routes cho khách hàng (customer)
 * =========================
 */
// Lấy đơn hàng của user đang đăng nhập
router.get("/my-orders", auth, getMyOrders);

// Tạo đơn hàng (customer)
router.post("/", auth, createOrder);

/**
 * =========================
 * Routes cho admin / staff
 * =========================
 */
// Lấy tất cả đơn hàng
router.get("/", auth, getOrders);

// Lấy đơn hàng theo id
router.get("/:id", auth, getOrderById);

// Cập nhật đơn hàng
router.put("/:id", auth, updateOrder);

// Xóa đơn hàng
router.delete("/:id", auth, deleteOrder);

// Lấy thống kê doanh thu
router.get("/stats/revenue", auth, getRevenueStats);


module.exports = router;
