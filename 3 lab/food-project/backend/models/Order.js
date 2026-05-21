const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items: [
    {
      dish: { type: mongoose.Schema.Types.ObjectId, ref: "Dish" },
      quantity: Number,
      price: Number,
    },
  ],
  total: Number,
  status: { 
    type: String, 
    enum: ["pending", "cooking", "delivering", "completed"], 
    default: "pending" 
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);