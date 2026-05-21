// backend/routes/orders.js
const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const User = require("../models/User");

router.post("/", async (req, res) => {
  try {
    const { userId, items } = req.body;
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = new Order({ user: userId, items, total });
    await order.save();

    await User.findByIdAndUpdate(userId, { $push: { orders: order._id } });

    res.json({ message: "Order placed", order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;