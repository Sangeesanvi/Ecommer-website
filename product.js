
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  description:String,
  price: Number,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  discount_percentage:Number,
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;

