// backend/seed.js
const mongoose = require("mongoose");
const Restaurant = require("./models/Restaurant");
const Dish = require("./models/Dish");
const User = require("./models/User");
const Order = require("./models/Order");

async function seed() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/foodDB");
    console.log("MongoDB connected");

    // --------------------
    // Очищаємо старі дані
    await Restaurant.deleteMany({});
    await Dish.deleteMany({});
    await User.deleteMany({});
    await Order.deleteMany({});

    // --------------------
    // Додаємо ресторани
    const r1 = await Restaurant.create({ name: "Italiano", cuisine: "Italian", rating: 5 });
    const r2 = await Restaurant.create({ name: "Burger House", cuisine: "American", rating: 4 });

    // --------------------
    // Додаємо страви
    const d1 = await Dish.create({
      name: "Margherita Pizza",
      description: "Classic pizza with tomato and mozzarella",
      price: 12.5,
      restaurant: r1._id
    });
    const d2 = await Dish.create({
      name: "Pepperoni Pizza",
      description: "Spicy pizza with pepperoni",
      price: 14,
      restaurant: r1._id
    });
    const d3 = await Dish.create({
      name: "Cheeseburger",
      description: "Juicy burger with cheese",
      price: 8.5,
      restaurant: r2._id
    });
    const d4 = await Dish.create({
      name: "Fries",
      description: "Crispy french fries",
      price: 3,
      restaurant: r2._id
    });

    // --------------------
    // Додаємо menu ресторанів (посилання на страви)
    r1.menu = [d1._id, d2._id];
    r2.menu = [d3._id, d4._id];
    await r1.save();
    await r2.save();

    // --------------------
    // Додаємо користувачів
    const u1 = await User.create({ name: "Alex", email: "alex@test.com", password: "123456" });
    const u2 = await User.create({ name: "Maria", email: "maria@test.com", password: "123456" });

    // --------------------
    // Додаємо замовлення
    const o1 = await Order.create({
      user: u1._id,
      restaurant: r1._id,
      items: [
        { dish: d1._id, name: d1.name, price: d1.price, quantity: 1 }
      ],
      total: d1.price,
      status: "delivered"
    });

    const o2 = await Order.create({
      user: u2._id,
      restaurant: r2._id,
      items: [
        { dish: d4._id, name: d4.name, price: d4.price, quantity: 2 }
      ],
      total: d4.price * 2,
      status: "preparing"
    });

    // Додаємо замовлення користувачам
    u1.orders.push(o1._id);
    u2.orders.push(o2._id);
    await u1.save();
    await u2.save();

    console.log("Seed finished successfully!");
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

seed();