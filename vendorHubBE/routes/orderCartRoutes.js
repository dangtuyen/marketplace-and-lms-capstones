const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const redisClient = require('../redisClient');
const Product = require('../models/Product');
const Order = require('../models/Order');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// AUTHENTICATION MIDDLEWARE: Verifies JWT token and appends user details to request object
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_here');
        req.user = decoded; // Contains payload: { id, role }
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token token." });
    }
};

// ROLE AUTHORIZATION MIDDLEWARE: Restricts routes exclusively to Admin or Vendor roles
const adminOrVendorMiddleware = (req, res, next) => {
    if (req.user.role !== 'admin' && req.user.role !== 'vendor') {
        return res.status(403).json({ message: "Forbidden. Access restricted to Admin or Vendor." });
    }
    next();
};

// =========================================================================
// REDIS CART CACHING OPERATIONS
// =========================================================================

// Fetch cart list from Redis Cache for current authenticated user
router.get('/cart', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const cachedCart = await redisClient.get(`cart:${userId}`);
        
        if (!cachedCart) {
            return res.json({ items: [], totalPrice: 0 });
        }
        return res.json(JSON.parse(cachedCart));
    } catch (error) {
        res.status(500).json({ message: "Redis database retrieval failure", error: error.message });
    }
});

// POST: Update or add items inside Redis Cache cart
router.post('/cart', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity } = req.body;

        // 1. Retrieve existing cart state from Redis cache
        let cart = await redisClient.get(`cart:${userId}`);
        cart = cart ? JSON.parse(cart) : { items: [], totalPrice: 0 };

        // 2. Fetch target product properties from MongoDB
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Target product catalog item not found." });

        const itemIndex = cart.items.findIndex(item => item.productId === productId);

        if (quantity <= 0) {
            if (itemIndex > -1) cart.items.splice(itemIndex, 1);
        } else {
            if (itemIndex > -1) {
                cart.items[itemIndex].quantity = quantity;
                cart.items[itemIndex].name = product.name; 
            } else {
                cart.items.push({
                    productId: product._id.toString(),
                    name: product.name, 
                    price: product.price,
                    image: product.image || '',
                    quantity: quantity
                });
            }
        }

        // Recalculate values
        cart.totalPrice = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        
        // Write back into Redis cache with a 7-day TTL
        await redisClient.setEx(`cart:${userId}`, 7 * 24 * 60 * 60, JSON.stringify(cart));
        return res.json({ message: "Redis structural sync complete", cart });
    } catch (error) {
        res.status(500).json({ message: "Redis caching write failure", error: error.message });
    }
});

// =========================================================================
// MONGODB PERMANENT ORDER LIFECYCLE MANAGEMENT
// =========================================================================

// POST: Process Marketplace Checkout with Modern Dynamic Stripe Payments
router.post('/orders/checkout', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const { shippingAddress } = req.body;

        if (!shippingAddress || !shippingAddress.trim()) {
            return res.status(400).json({ message: "Shipping address data is required." });
        }

        const cachedCart = await redisClient.get(`cart:${userId}`);
        if (!cachedCart) return res.status(400).json({ message: "Shopping cart session empty." });

        const cart = JSON.parse(cachedCart);
        if (!cart.items || cart.items.length === 0) return res.status(400).json({ message: "Cart is empty." });

        const totalAmountInCents = Math.round(cart.totalPrice * 100);
        const commissionPercentage = Number(process.env.PLATFORM_COMMISSION_FEE) || 10;
        const platformFeeInCents = Math.round(totalAmountInCents * (commissionPercentage / 100));

        // 1. EXTRACT VENDOR DESTINATION AND VALIDATE ID FORMAT
        let vendorDestinationAccount = null;
        try {
            const firstItemProduct = await Product.findById(cart.items[0]?.productId || cart.items?.productId);
            if (firstItemProduct && firstItemProduct.stripeConnectId && firstItemProduct.stripeConnectId.startsWith('acct_') && firstItemProduct.stripeConnectId.length > 10) {
                vendorDestinationAccount = firstItemProduct.stripeConnectId;
            }
        } catch (e) {
            console.log("No valid connected account found. Defaulting to standalone checkout charge mode.");
        }

        // 2. CONSTRUCT MODERN STRIPE INTENT PAYLOAD
        let stripePayload = {
            amount: totalAmountInCents,
            currency: 'usd',
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: { customerId: userId, shippingAddress: shippingAddress.trim() }
        };

        // If a valid Stripe Connected Account format is found, inject the split payload parameters safely
        if (vendorDestinationAccount && vendorDestinationAccount !== 'acct_1NJxTestAccount') {
            stripePayload.application_fee_amount = platformFeeInCents;
            stripePayload.transfer_data = { destination: vendorDestinationAccount };
            console.log(`Attempting multi-vendor split payout targeting connected account: ${vendorDestinationAccount}`);
        } else {
            console.log("Standard standalone platform payment intent charge mode activated.");
        }

        // 3. SECURELY CREATE PAYMENT INTENT WITH TRY-CATCH FALLBACK
        let paymentIntent;
        try {
            paymentIntent = await stripe.paymentIntents.create(stripePayload);
        } catch (stripeError) {
            console.warn("Stripe Connect Transfer failed due to incomplete vendor onboarding. Falling back to Standard Standalone Payment...");
            
            // Fallback: Strip the multi-vendor connect fields and charge directly to the main platform account
            delete stripePayload.application_fee_amount;
            delete stripePayload.transfer_data;
            
            paymentIntent = await stripe.paymentIntents.create(stripePayload);
        }

        // 4. PERSIST PERMANENT TRACKING RECORD IN MONGODB
        const newOrder = new Order({
            customerId: userId,
            items: cart.items.map(item => ({
                productId: item.productId,
                name: item.name || "Marketplace Product",
                price: item.price,
                quantity: item.quantity
            })),
            totalPrice: cart.totalPrice,
            shippingAddress: shippingAddress.trim(),
            status: 'placed',
            history: [{ status: 'placed', updatedAt: new Date() }]
        });

        await newOrder.save();
        await redisClient.del(`cart:${userId}`); // Clear temporary cache storage instantly

        return res.status(201).json({ 
            message: "Stripe transaction intent successfully generated.",
            clientSecret: paymentIntent.client_secret,
            orderId: newOrder._id
        });

    } catch (error) {
        console.error("CRITICAL CHECKOUT ERROR LOGGED:", error);
        return res.status(500).json({ 
            message: "Stripe interface mapping layer error context initialization crash.", 
            error: error.message 
        });
    }
});

// Fetch historical order status collections for user profiles, or fetch total application volume datasets if requested by Admin
router.get('/orders', authMiddleware, async (req, res) => {
    try {
        let orders;
        if (req.user.role === 'admin') {
            orders = await Order.find().populate('customerId', 'name email').sort({ createdAt: -1 });
        } else {
            orders = await Order.find({ customerId: req.user.id }).sort({ createdAt: -1 });
        }
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Database order pipeline data processing failure", error: error.message });
    }
});

// Mutate Order state machine records over execution milestones (placed -> packed -> shipped -> delivered)
router.put('/orders/:orderId/status', authMiddleware, adminOrVendorMiddleware, async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body; 

        // Assert target string matches valid finite state criteria parameters
        const validStatuses = ['placed', 'packed', 'shipped', 'delivered'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Illegal transition parameter string layout configuration context assignment." });
        }

        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: "Target transactional document identification mismatch." });

        // Apply string modification updates and push timeline snapshots dynamically into history tracking list arrays
        order.status = status;
        order.history.push({ status: status, updatedAt: new Date() });
        
        await order.save();
        res.json({ message: `Order operational tracking sequence updated successfully to state: ${status}`, order });
    } catch (error) {
        res.status(500).json({ message: "State sequence assignment mutation task failure processing error", error: error.message });
    }
});

module.exports = router;