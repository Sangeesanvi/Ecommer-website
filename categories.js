const express = require("express");
const router = express.Router();
const Category = require("../models/category");
const Product = require("../models/Product"); 

// Get all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific category by ID
router.get("/:id", getCategory, (req, res) => {
  res.json(res.category);
});

// Create a new category
router.post("/", async (req, res) => {
  const category = new Category({
    name: req.body.name,
    description: req.body.description,
  });

  try {
    const newCategory = await category.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a category by ID
router.patch("/:id", getCategory, async (req, res) => {
  if (req.body.name != null) {
    res.category.name = req.body.name;
  }
  if (req.body.description != null) {
    res.category.description = req.body.description;
  }

  try {
    const updatedCategory = await res.category.save();
    res.json(updatedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a category by ID
router.delete("/:id", async (req, res) => {
  try {
    const categoryId = req.params.id;
    console.log('Deleting category with ID:', categoryId);

    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Delete associated products
    await Product.deleteMany({ category: category._id });

    // Delete the category itself
    await Category.deleteOne({ _id: category._id });

    res.json({ message: 'Category and associated products deleted' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



// Middleware function to get a specific category by ID
async function getCategory(req, res, next) {
  let category;
  try {
    category = await Category.findById(req.params.id);
    if (category == null) {
      return res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  // Manually query for associated products
  try {
    const products = await Product.find({ category: category._id });
    category = category.toObject();
    category.products = products;
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  res.category = category;
  next();
}




module.exports = router;
