const bcrypt = require("bcryptjs");
const User = require("./models/user.model");

async function seedAdmin() {
  try {
    const adminEmail = "admin@shop.com";
    const adminUser = await User.findOne({ email: adminEmail });

    if (!adminUser) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await User.create({
        name: "Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
        username: "admin"   // 👈 thêm username nếu schema có
      });
      console.log("✅ Admin user created");
    } else {
      console.log("ℹ️ Admin already exists");
    }
  } catch (err) {
    console.error("❌ Lỗi khi tạo admin:", err.message);
  }
}

module.exports = seedAdmin;
