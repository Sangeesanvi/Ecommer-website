const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific product
router.get("/:id", getProduct, (req, res) => {
  res.json(res.product);
});

// Create a new product
router.post("/", async (req, res) => {
  const product = new Product({
    name: req.body.name,
    price: req.body.price,
    category: req.body.category,
    description: req.body.description,
    discount_percentage: req.body.discount_percentage,
  });

  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a product
router.patch("/:id", getProduct, async (req, res) => {
  if (req.body.name != null) {
    res.product.name = req.body.name;
  }
  if (req.body.price != null) {
    res.product.price = req.body.price;
  }
  if (req.body.category != null) {
    res.product.category = req.body.category;
  }
  if (req.body.description != null) {
    res.product.description = req.body.description;
  }
  if (req.body.discount_percentage != null) {
    res.product.discount_percentage = req.body.discount_percentage;
  }

  try {
    const updatedProduct = await res.product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a product
router.delete("/:id", getProduct, async (req, res) => {
  try {
    await Product.deleteOne({ _id: res.product._id });
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Middleware function to get a specific product by ID
async function getProduct(req, res, next) {
  let product;
  try {
    product = await Product.findById(req.params.id);
    if (product == null) {
      return res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  res.product = product;
  next();
}

module.exports = router;





// GET /api/v1/products: Get all products.
// GET /api/v1/products/:id: Get a specific product by ID.
// POST /api/v1/products: Create a new product.
// PATCH /api/v1/products/:id: Update a specific product by ID.
// DELETE /api/v1/products/:id: Delete a specific product by ID.