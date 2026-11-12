const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    customerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    items: [{
        productId: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        image: { type: String, default: '' },
        quantity: { type: Number, required: true }
    }],
    totalPrice: { 
        type: Number, 
        required: true 
    },
    shippingAddress: { 
        type: String, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['placed', 'packed', 'shipped', 'delivered'], 
        default: 'placed' 
    },
    history: [
        {
            status: { type: String, required: true },
            updatedAt: { type: Date, default: Date.now }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);