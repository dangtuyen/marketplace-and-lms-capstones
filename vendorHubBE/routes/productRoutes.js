const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const jwt = require('jsonwebtoken');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { s3Client, upload } = require('../middleware/s3Upload');

// Token extraction check gate
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: "Access denied. Token missing." });
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_here');
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid session." });
    }
};

// GET: Fetch products dynamically (Public showcase OR filtered by logged-in Vendor ID)
router.get('/products', async (req, res) => {
    try {
        const { search, minPrice, maxPrice, sort } = req.query;
        let queryCondition = {};

        const authHeader = req.header('Authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
            try {
                const token = authHeader.replace('Bearer ', '');
                const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_here');
                
                if (decoded.role === 'vendor') {
                    queryCondition.vendorId = decoded.id;
                    console.log(`Isolating product catalog search results to Vendor ID: ${decoded.id}`);
                }
            } catch (tokenError) {
                console.log("Token verification skipped during catalog pull.");
            }
        }

        // Apply additional keyword search criteria mappings
        if (search && search.trim() !== '') {
            queryCondition.$or = [
                { name: { $regex: search.trim(), $options: 'i' } },
                { description: { $regex: search.trim(), $options: 'i' } }
            ];
        }

        if (minPrice || maxPrice) {
            queryCondition.price = {};
            if (minPrice) queryCondition.price.$gte = Number(minPrice);
            if (maxPrice) queryCondition.price.$lte = Number(maxPrice);
        }

        let sortCondition = { createdAt: -1 };
        if (sort === 'price_asc') sortCondition = { price: 1 };
        if (sort === 'price_desc') sortCondition = { price: -1 };

        const products = await Product.find(queryCondition).sort(sortCondition);
        return res.json(products);

    } catch (error) {
        console.error("SEARCH API FAILURE:", error);
        return res.status(500).json({ 
            message: "Failed to query product catalog with active search constraints.", 
            error: error.message 
        });
    }
});

// VENDOR ONBOARDING: Seller account upgrade registration API
router.post('/vendor/onboard', authMiddleware, async (req, res) => {
    try {
        const { stripeConnectId } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "Account does not exist." });

        user.role = 'vendor';
        if (stripeConnectId) user.stripeConnectId = stripeConnectId;
        await user.save();

        return res.json({ 
            message: "Vendor privileges activated successfully!", 
            user: { name: user.name, email: user.email, role: user.role }
        });
    } catch (error) { res.status(500).json({ message: error.message }); }
});

// PRODUCT CRUD: Product creation API with direct image upload to Supabase Cloud
router.post('/products', authMiddleware, upload.single('image'), async (req, res) => {
    try {
        if (req.user.role !== 'vendor' && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Only accounts with Vendor privileges are allowed to list products for sale." });
        }

        const { name, price, description, stripeConnectId } = req.body;
        const supabaseBaseUrl = process.env.S3_ENDPOINT.replace('/storage/v1/s3', '');
        let imageUrl = '';

        if (req.file) {
            const fileExtension = req.file.originalname.split('.').pop();
            const s3FileName = `products/${Date.now()}-${Math.round(Math.random() * 1E9)}.${fileExtension}`;

            const s3Params = {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: s3FileName,
                Body: req.file.buffer,
                ContentType: req.file.mimetype,
            };

            // Execute image upload command to Supabase Cloud
            await s3Client.send(new PutObjectCommand(s3Params));
            
            // CDN public image URL builder function for React Front-end
            imageUrl = `${supabaseBaseUrl}/storage/v1/object/public/${process.env.S3_BUCKET_NAME}/${s3FileName}`;
        } else {
            imageUrl = `https://dicebear.com{encodeURIComponent(name)}`;
        }

        const newProduct = new Product({
            name,
            price: Number(price),
            description,
            stripeConnectId: stripeConnectId || 'acct_1NJxTestAccount',
            vendorId: req.user.id,
            image: imageUrl
        });

        await newProduct.save();
        return res.status(201).json({ message: "Product with cloud image listed successfully!", product: newProduct });
    } catch (error) {
        console.error("Supabase S3 synchronization error:", error);
        res.status(500).json({ message: "S3 storage server connection error.", error: error.message });
    }
});

router.put('/products/:id', authMiddleware, upload.single('image'), async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, description } = req.body;

        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: "Product record not found." });

        // Verify record ownership
        if (product.vendorId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied! You do not own this product category." });
        }

        // Update standard text fields
        if (name) product.name = name.trim();
        if (price) product.price = Number(price);
        if (description) product.description = description.trim();

        // HANDLE REPLACING NEW IMAGE FILE ON SUPABASE CLOUD (S3)
        if (req.file) {
            const fileExtension = req.file.originalname.split('.').pop();
            const s3FileName = `products/${Date.now()}-${Math.round(Math.random() * 1E9)}.${fileExtension}`;

            const s3Params = {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: s3FileName,
                Body: req.file.buffer,
                ContentType: req.file.mimetype,
            };

            // Upload new image file to the cloud
            await s3Client.send(new PutObjectCommand(s3Params));
            
            // Update the new public CDN URL into the MongoDB Document
            const supabaseBaseUrl = process.env.S3_ENDPOINT.replace('/storage/v1/s3', '');
            product.image = `${supabaseBaseUrl}/storage/v1/object/public/${process.env.S3_BUCKET_NAME}/${s3FileName}`;
        }

        await product.save();
        return res.json({ message: "Product specifications and images updated successfully!", product });

    } catch (error) {
        console.error("PRODUCT UPDATE API ERROR WITH IMAGES:", error);
        return res.status(500).json({ message: "S3/MongoDB data overwrite issue.", error: error.message });
    }
});

// DELETE: Purge targeted document registries permanently
router.delete('/products/:id', authMiddleware, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Listing not found." });

        if (product.vendorId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Unauthorized deletion attempt." });
        }

        await product.deleteOne();
        res.json({ message: "Product purged successfully from catalog logs." });
    } catch (err) {
        res.status(500).json({ message: "Deletion execution crash.", error: err.message });
    }
});

module.exports = router;