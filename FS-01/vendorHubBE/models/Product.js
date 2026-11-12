const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    image: { type: String, default: '' },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    stripeConnectId: { type: String, default: 'acct_1NJxTestAccount' }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
