const express = require("express");
const router = express.Router();
const Restaurant = require("../models/Restaurant");
const Dish = require("../models/Dish");


// 🔹 GET всі ресторани
router.get("/", async (req, res) => {
  try {
    const restaurants = await Restaurant.find().populate("menu");
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// 🔹 GET ресторан по ID
router.get("/:id", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).populate("menu");
    if (!restaurant)
      return res.status(404).json({ message: "Restaurant not found" });

    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// 🔹 POST створення ресторану
router.post("/", async (req, res) => {
  try {
    const newRestaurant = new Restaurant(req.body);
    await newRestaurant.save();
    res.status(201).json(newRestaurant);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// 🔹 PUT оновлення ресторану
router.put("/:id", async (req, res) => {
  try {
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedRestaurant)
      return res.status(404).json({ message: "Restaurant not found" });

    res.json(updatedRestaurant);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// 🔹 DELETE ресторану
router.delete("/:id", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant)
      return res.status(404).json({ message: "Restaurant not found" });

    // видаляємо всі страви цього ресторану
    await Dish.deleteMany({ restaurant: restaurant._id });

    await Restaurant.findByIdAndDelete(req.params.id);

    res.json({ message: "Restaurant deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// 🔹 GET меню конкретного ресторану
router.get("/:id/menu", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant)
      return res.status(404).json({ message: "Restaurant not found" });

    const dishes = await Dish.find({ restaurant: req.params.id });
    res.json(dishes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;