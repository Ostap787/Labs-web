// backend/routes/dishes.js
const express = require("express");
const router = express.Router();
const Dish = require("../models/Dish");
const Restaurant = require("../models/Restaurant");

// GET усі страви
router.get("/", async (req, res) => {
  const dishes = await Dish.find().populate("restaurant");
  res.json(dishes);
});

// POST створення страви
router.post("/", async (req, res) => {
  const { name, description, price, restaurantId } = req.body;
  const newDish = new Dish({ name, description, price, restaurant: restaurantId });
  await newDish.save();

  // Додаємо страву в ресторан
  const restaurant = await Restaurant.findById(restaurantId);
  restaurant.menu.push(newDish._id);
  await restaurant.save();

  res.json(newDish);
});

// DELETE страви
router.delete("/:id", async (req, res) => {
  await Dish.findByIdAndDelete(req.params.id);
  res.json({ message: "Dish deleted" });
});

module.exports = router;