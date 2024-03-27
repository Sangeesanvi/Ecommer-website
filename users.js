const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Order = require("../models/order");

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific user by ID
router.get("/:id", getUser, (req, res) => {
  res.json(res.user);
});

// Create a new user
router.post("/", async (req, res) => {
  const user = new User({
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    location: req.body.location,
  });

  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a user by ID
router.patch("/:id", getUser, async (req, res) => {
  if (req.body.name != null) {
    res.user.name = req.body.name;
  }
  if (req.body.username != null) {
    res.user.username = req.body.username;
  }
  if (req.body.email != null) {
    res.user.email = req.body.email;
  }
  if (req.body.password != null) {
    res.user.password = req.body.password;
  }
  if (req.body.location != null) {
    res.user.location = req.body.location;
  }

  try {
    const updatedUser = await res.user.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a user by ID
router.delete("/:id", getUser, async (req, res) => {
  try {
    // Delete associated orders
    await Order.deleteMany({ user_id: res.user._id });

    // Delete the user itself
    await User.deleteOne({ _id: res.user._id });

    res.json({ message: "User and associated orders deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Middleware function to get a specific user by ID
async function getUser(req, res, next) {
  let user;
  try {
    user = await User.findById(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  res.user = user;
  next();
}

module.exports = router;
