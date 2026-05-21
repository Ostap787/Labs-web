// backend/routes/users.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });

    await newUser.save();
    res.json({ message: "User created", user: newUser });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Логін користувача (прощий, без JWT поки)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });
    res.json({ message: "Logged in", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET усіх користувачів (для тесту)
router.get("/", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

module.exports = router;