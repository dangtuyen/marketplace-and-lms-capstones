const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Review = require('../models/Review');
const Coupon = require('../models/Coupon');

// MIDDLEWARE: Identity authentication supports both Header and URL Query string
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '') || req.query.token;
    
    if (!token) return res.status(401).json({ message: "Access denied. Missing token." });
    
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_here');
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token." });
    }
};

// ==========================================
// COUPONS FEATURE
// ==========================================

// Validate and apply coupon
router.post('/coupons/validate', authMiddleware, async (req, res) => {
    try {
        const { code } = req.body;
        const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
        
        if (!coupon) return res.status(404).json({ message: "Invalid or locked coupon." });
        if (new Date() > coupon.expiryDate) return res.status(400).json({ message: "The coupon code has expired." });

        return res.json({ message: "Coupon applied successfully!", discountValue: coupon.discountValue });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ==========================================
// REVIEWS FEATURE
// ==========================================

// Add a new product review
router.post('/reviews', authMiddleware, async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;
        const newReview = new Review({ productId, customerId: req.user.id, rating, comment });
        await newReview.save();
        res.status(201).json({ message: "Thank you for leaving a review!", review: newReview });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get list of product reviews
router.get('/reviews/:productId', async (req, res) => {
    try {
        const reviews = await Review.find({ productId: req.params.productId }).populate('customerId', 'name').sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ==========================================
// ADMIN ANALYTICS
// ==========================================
router.get('/admin/analytics', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ message: "Access denied! Only Admins have access permissions." });

        const orders = await Order.find();
        const totalSales = orders.reduce((acc, order) => acc + order.totalPrice, 0);
        const platformCommission = totalSales * 0.1; // Simulate 10% platform commission fee collection

        // Order statistics by lifecycle status
        const statusBreakdown = { placed: 0, packed: 0, shipped: 0, delivered: 0 };
        orders.forEach(order => { if (statusBreakdown[order.status] !== undefined) statusBreakdown[order.status]++; });

        res.json({
            totalOrders: orders.length,
            totalSales,
            platformCommission,
            statusBreakdown
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ==========================================
// GENERATE ORDER INVOICE
// ==========================================
router.get('/orders/:orderId/invoice', authMiddleware, async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId).populate('customerId', 'name email');
        if (!order) return res.status(404).json({ message: "Order information not found." });

        // Create a clean, standard Amazon static HTML invoice interface layout
        const htmlInvoiceTemplate = `
            <html>
            <head>
                <style>
                    body { font-family: sans-serif; padding: 30px; color: #333; line-height: 1.5; }
                    .header { border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 20px; }
                    .grid { display: flex; justify-content: space-between; margin-bottom: 30px; }
                    table { w-full; border-collapse: collapse; margin-top: 20px; width: 100%; }
                    th { bg-color: #f3f4f6; text-align: left; padding: 10px; border: 1px solid #e5e7eb; }
                    td { padding: 10px; border: 1px solid #e5e7eb; }
                    .total { text-align: right; font-size: 20px; font-weight: bold; margin-top: 20px; color: #2563eb; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h2>COMMERCIAL INVOICE NETWORK - NEXMALL</h2>
                    <p>Electronic invoice reference code: <strong>${order._id}</strong></p>
                </div>
                <div class="grid">
                    <div>
                        <h4>Receiving customer:</h4>
                        <p>Full name: ${order.customerId?.name || 'Guest customer'}</p>
                        <p>Email: ${order.customerId?.email || 'N/A'}</p>
                    </div>
                    <div>
                        <h4>Shipping address:</h4>
                        <p>${order.shippingAddress}</p>
                        <p>Payment date: ${new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Item description</th>
                            <th>Unit price</th>
                            <th>Quantity</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.items.map(item => `
                            <tr>
                                <td>${item.name}</td>
                                <td>$${item.price}</td>
                                <td>${item.quantity}</td>
                                <td>$${item.price * item.quantity}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <div class="total">Final settlement amount: $${order.totalPrice}</div>
            </body>
            </html>
        `;

        res.send(htmlInvoiceTemplate);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;