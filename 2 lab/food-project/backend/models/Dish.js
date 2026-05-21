// backend/models/Dish.js
const mongoose = require("mongoose");

const dishSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" }
});

module.exports = mongoose.model("Dish", dishSchema);