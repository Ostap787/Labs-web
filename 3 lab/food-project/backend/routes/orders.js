const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Order = require("../models/Order");
const Dish = require("../models/Dish");

router.post("/", auth, async (req, res) => {
  try {
    const { items } = req.body;

    let total = 0;
    const updatedItems = [];

    for (const item of items) {
      const dish = await Dish.findById(item.dish);
      if (!dish) continue;

      const itemTotal = dish.price * item.quantity;
      total += itemTotal;

      updatedItems.push({
        dish: dish._id,
        quantity: item.quantity,
        price: dish.price
      });
    }

    const newOrder = new Order({
      user: req.user.userId,
      items: updatedItems,
      total,
      status: "pending"
    });

    await newOrder.save();

    setTimeout(async () => {
      await Order.findByIdAndUpdate(newOrder._id, { status: "Cooking" });
    }, 5000);

    setTimeout(async () => {
      await Order.findByIdAndUpdate(newOrder._id, { status: "Delivering" });
    }, 10000);

    setTimeout(async () => {
      await Order.findByIdAndUpdate(newOrder._id, { status: "Delivered" });
    }, 15000);

    res.json(newOrder);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get("/", auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId })
      .populate("items.dish");

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.put("/:id/status", auth, async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Order completed and removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;