// middleware/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

module.exports = async function (req, res, next) {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(401).json({ message: "Không có token" });
    }

    const token = authHeader.split(" ")[1]; // dạng "Bearer <token>"
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Lấy thông tin user từ DB
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User không tồn tại" });
    }

    req.user = user; // gắn user vào request
    next();
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(401).json({ message: "Token không hợp lệ" });
  }
};
