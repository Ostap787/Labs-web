const mongoose = require("mongoose");
const Restaurant = require("./models/Restaurant");
const Dish = require("./models/Dish");

mongoose.connect("mongodb://localhost:27017/foodDB");

const restaurants = [
  {
    name: "Pizza Palace",
    cuisine: "Italian",
    rating: 4.7,
  },
  {
    name: "Burger House",
    cuisine: "Fast Food",
    rating: 4.5,
  },
  {
    name: "Sushi World",
    cuisine: "Japanese",
    rating: 4.8,
  },
  {
    name: "Healthy Bowl",
    cuisine: "Healthy",
    rating: 4.6,
  },
];

const dishes = [
  // 🍕 Pizza Palace
  {
    name: "Margherita Pizza",
    description: "Tomato, mozzarella, basil",
    price: 10,
    image:
      "https://images.unsplash.com/photo-1548365328-9f547f9d7a9f?auto=format&fit=crop&w=800&q=80",
    restaurantIndex: 0,
  },
  {
    name: "Pepperoni Pizza",
    description: "Cheese & pepperoni",
    price: 12,
    image:
      "https://images.unsplash.com/photo-1601924582971-3f1f1c3c3b2a?auto=format&fit=crop&w=800&q=80",
    restaurantIndex: 0,
  },

  // 🍔 Burger House
  {
    name: "Classic Burger",
    description: "Beef, lettuce, cheese",
    price: 9,
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    restaurantIndex: 1,
  },
  {
    name: "Cheeseburger",
    description: "Double cheese burger",
    price: 11,
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80",
    restaurantIndex: 1,
  },

  // 🍣 Sushi World
  {
    name: "Salmon Sushi",
    description: "Fresh salmon roll",
    price: 14,
    image:
      "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=800&q=80",
    restaurantIndex: 2,
  },
  {
    name: "Tuna Roll",
    description: "Tuna with rice",
    price: 13,
    image:
      "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&w=800&q=80",
    restaurantIndex: 2,
  },

  // 🥗 Healthy Bowl
  {
    name: "Avocado Bowl",
    description: "Healthy avocado mix",
    price: 12,
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
    restaurantIndex: 3,
  },
  {
    name: "Protein Salad",
    description: "Chicken & greens",
    price: 11,
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    restaurantIndex: 3,
  },
];

async function seed() {
  try {
    await Restaurant.deleteMany();
    await Dish.deleteMany();

    const createdRestaurants = await Restaurant.insertMany(restaurants);

    const dishesWithRestaurant = dishes.map((dish) => ({
      name: dish.name,
      description: dish.description,
      price: dish.price,
      image: dish.image,
      restaurant: createdRestaurants[dish.restaurantIndex]._id,
    }));

    await Dish.insertMany(dishesWithRestaurant);

    console.log("🔥 DATABASE SEEDED SUCCESSFULLY!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();