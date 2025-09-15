require("dotenv").config(); // để đọc file .env
const mongoose = require("mongoose");
const Product = require("./models/Product");
const Inventory = require("./models/Inventory");

const MONGO_URI = process.env.MONGO_URI; // lấy từ .env

async function syncInventory() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("✅ Đã kết nối MongoDB");

    const products = await Product.find();
    console.log(`📦 Có ${products.length} sản phẩm trong DB`);

    for (const product of products) {
      const existingInv = await Inventory.findOne({ product: product._id });
      if (!existingInv) {
        const inv = new Inventory({
          product: product._id,
          stock: 0,
          location: "Default Warehouse"
        });
        await inv.save();
        console.log(`➕ Tạo inventory cho sản phẩm: ${product.name}`);
      } else {
        console.log(`✅ Inventory đã tồn tại cho: ${product.name}`);
      }
    }

    console.log("🎉 Hoàn tất đồng bộ inventory!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Lỗi:", err);
    process.exit(1);
  }
}

syncInventory();
