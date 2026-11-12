const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
  const products = await Product.find().populate('vendor', 'name');
  res.json(products);
};

exports.createProduct = async (req, res) => {
  try {
    const { title, description, price, image } = req.body;
    const product = await Product.create({ title, description, price, image, vendor: req.user.id });
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.addReview = async (req, res) => {
  try {
    const { rating, comment, user } = req.body;
    const product = await Product.findById(req.params.id);
    product.reviews.push({ user, rating, comment });
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};