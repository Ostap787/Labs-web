const mongoose = require("mongoose");

const dishSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },

  image: {
    type: String,
    default: "https://via.placeholder.com/300"
  },

  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant"
  }
});

module.exports = mongoose.model("Dish", dishSchema);