const express = require("express");
const {
  getInventory,
  getInventoryByProduct,
  updateInventory,
} = require("../controllers/inventoryController");

const router = express.Router();

router.get("/", getInventory);
router.get("/:productId", getInventoryByProduct);
router.post("/", updateInventory);

module.exports = router;
