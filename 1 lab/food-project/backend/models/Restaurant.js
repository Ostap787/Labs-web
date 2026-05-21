// backend/models/Restaurant.js
const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cuisine: String,
  rating: Number,
  menu: [{ type: mongoose.Schema.Types.ObjectId, ref: "Dish" }] // посилання на страви
});

module.exports = mongoose.model("Restaurant", restaurantSchema);