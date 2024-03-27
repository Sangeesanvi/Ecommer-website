const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  product_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  order_date: { type: Date, default: Date.now },
  quantity: [Number],
  totalAmount: Number,
});

// total Amount
orderSchema.pre('save', async function (next) {
  try {
    const productDocs = await mongoose.model('Product').find({ _id: { $in: this.product_ids } });

    let totalAmount = 0;
    for (let i = 0; i < productDocs.length; i++) {
      const discountedPrice = productDocs[i].price * (1 - productDocs[i].discount_percentage / 100);
      totalAmount += discountedPrice * this.quantity[i];
    }

    this.totalAmount = totalAmount;

    next();
  } catch (error) {
    next(error);
  }
});

// total sales per day
orderSchema.statics.getTotalSalesPerDay = async function (date) {
  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const totalSales = await this.aggregate([
      {
        $match: {
          order_date: { $gte: startOfDay, $lte: endOfDay },
        },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalAmount" },
        },
      },
    ]);

    return totalSales.length > 0 ? totalSales[0].totalSales : 0;
  } catch (error) {
    throw error;
  }
};



// total sales per user
const { ObjectId } = mongoose.Types;

orderSchema.statics.getTotalSalesByUser = async function (user_id) {
  try {
    const totalSales = await this.aggregate([
      {
        $group: {
          _id: '$user_id',
          totalSales: { $sum: '$totalAmount' },
        },
      },
    ]);

    return totalSales.length > 0 ? totalSales[0].totalSales : 0;
  } catch (error) {
    throw error;
  }
};







const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
