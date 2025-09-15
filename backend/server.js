require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");   // 👈 dùng db.js
const seedAdmin = require("./seedAdmin");   // 👈 seeder

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/inventory", require("./routes/inventoryRoutes"));


// Kết nối MongoDB + seed admin
connectDB().then(async () => {
  console.log("✅ MongoDB connected");

  await seedAdmin(); // 👈 tạo admin mặc định nếu chưa có

  // Routes
  app.get("/", (req, res) => {
    res.send("API Running...");
  });

  app.use("/api/auth", require("./routes/auth.routes"));
  app.use("/api/products", require("./routes/productRoutes"));
  app.use("/api/orders", require("./routes/orderRoutes"));
  app.use("/api/inventory", require("./routes/inventoryRoutes"));

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});
