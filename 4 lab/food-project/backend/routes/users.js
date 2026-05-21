const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

const SECRET_KEY = process.env.JWT_SECRET || "MY_SECRET_KEY";

/**
 * REGISTER
 */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashed,
      fcmToken: null,
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.json({ user, token });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

/**
 * LOGIN
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.json({ user, token });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

/**
 * SAVE PUSH TOKEN (FIXED)
 */
router.post("/fcm-token", auth, async (req, res) => {
  try {
    console.log("===== FCM REQUEST =====");
    console.log("BODY:", req.body);
    console.log("USER:", req.user);

    const { token } = req.body;
    const userId = req.user?.userId;

    if (!token) {
      return res.status(400).json({ message: "No token" });
    }

    if (!userId) {
      return res.status(401).json({ message: "No user id from token" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { fcmToken: token } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("✅ SAVED FCM TOKEN:", user.fcmToken);

    res.json({
      ok: true,
      fcmToken: user.fcmToken,
    });

  } catch (e) {
    console.log("❌ FCM ERROR:", e);
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;