const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const mongoose = require("mongoose");

// Get all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific order by ID
router.get("/:id", getOrder, (req, res) => {
  res.json(res.order);
});

// Create a new order
router.post("/", async (req, res) => {
  const order = new Order({
    user_id: req.body.user_id,
    product_ids: req.body.product_ids,
    order_date: req.body.order_date,
    quantity: req.body.quantity,
  });

  try {
    const newOrder = await order.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update an order by ID
router.patch("/:id", getOrder, async (req, res) => {
  if (req.body.user_id != null) {
    res.order.user_id = req.body.user_id;
  }
  if (req.body.product_ids != null) {
    res.order.product_ids = req.body.product_ids;
  }
  if (req.body.order_date != null) {
    res.order.order_date = req.body.order_date;
  }
  if (req.body.quantity != null) {
    res.order.quantity = req.body.quantity;
  }

  try {
    const updatedOrder = await res.order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete an order by ID
router.delete("/:id", getOrder, async (req, res) => {
  try {
    await res.order.remove();
    res.json({ message: "Order deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Middleware function to get a specific order by ID
async function getOrder(req, res, next) {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.order = order;
    next();
  } catch (error) {
    console.error('Error getting order:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}


// Route to get total sales per day
router.get('/totalSalesPerDay/:date', async (req, res) => {
    try {
      const date = req.params.date;
  
      if (!date) {
        return res.status(400).json({ error: 'Date parameter is required' });
      }
  
      const totalSales = await Order.getTotalSalesPerDay(date);
  
      res.json({ totalSales });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  router.get('/totalSalesByUser/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
  
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: 'Invalid User ID' });
      }
  
      const totalSales = await Order.getTotalSalesByUser(userId);
  
      res.json({ totalSales });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  

module.exports = router;
