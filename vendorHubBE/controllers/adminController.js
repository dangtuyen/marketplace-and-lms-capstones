const Product = require('../models/Product');
const User = require('../models/User');

exports.getAnalytics = async (req, res) => {
  const totalProducts = await Product.countDocuments();
  const totalUsers = await User.countDocuments();
  res.json({ totalProducts, totalUsers, totalSales: 15420, totalOrders: 132 });
};