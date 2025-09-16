// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const connectDB = require("./config/db");   // 👈 dùng db.js
// const seedAdmin = require("./seedAdmin");   // 👈 seeder
// const authRoutes = require("./routes/auth.routes");

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use("/api/inventory", require("./routes/inventoryRoutes"));
// app.use("/api/auth", authRoutes);

// // Kết nối MongoDB + seed admin
// connectDB().then(async () => {
//   console.log("✅ MongoDB connected");

//   await seedAdmin(); // 👈 tạo admin mặc định nếu chưa có

//   // Routes
//   app.get("/", (req, res) => {
//     res.send("API Running...");
//   });

//   app.use("/api/auth", require("./routes/auth.routes"));
//   app.use("/api/products", require("./routes/productRoutes"));
//   app.use("/api/orders", require("./routes/orderRoutes"));
//   app.use("/api/inventory", require("./routes/inventoryRoutes"));

//   const PORT = process.env.PORT || 5000;
//   app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
// });
// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const seedAdmin = require("./seedAdmin");

const app = express();

// middleware chung
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:3000", // frontend origin
    credentials: true,
  })
);

// simple root
app.get("/", (req, res) => res.send("API Running..."));

async function start() {
  try {
    await connectDB();
    console.log("✅ MongoDB connected");

    // Seed admin nếu cần
    if (typeof seedAdmin === "function") {
      await seedAdmin();
      console.log("✅ seedAdmin done (if needed)");
    }

    // mount routes - MOUNT ONCE here
    app.use("/api/auth", require("./routes/auth.routes"));
    app.use("/api/products", require("./routes/productRoutes"));
    app.use("/api/orders", require("./routes/orderRoutes"));
    app.use("/api/inventory", require("./routes/inventoryRoutes"));

    // route list for debugging
    if (app._router) {
      console.log("Registered routes:");
      app._router.stack
        .filter((r) => r.route && r.route.path)
        .forEach((r) => {
          const methods = r.route.stack.map((s) => s.method).join(",").toUpperCase();
          console.log(`${methods}  ${r.route.path}`);
        });
    }

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();
