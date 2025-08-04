// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
//      Imports
// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
const mongoose = require('mongoose');

// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
//      Order Schema Definition
// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
// This schema defines the structure for a completed order.
const orderSchema = new mongoose.Schema({
    // Reference to the user who placed the order.
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // An array of items that were in the order.
    // We store a snapshot of product details (name, price) at the time of purchase.
    // This prevents order history from changing if a product's price is updated later.
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true } // Price per item at time of order
    }],
    // The total cost of the order.
    totalAmount: {
        type: Number,
        required: true
    },
    // The current status of the order.
    status: {
        type: String,
        enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled', 'Returned'],
        default: 'Pending'
    },
    // We can add more fields like shipping address, payment details later.
    shippingAddress: {
        address: { type: String },
        city: { type: String },
        postalCode: { type: String },
        country: { type: String }
    },
    paymentResult: {
        id: { type: String },
        status: { type: String },
        update_time: { type: String },
        email_address: { type: String }
    }
}, {
    // Automatically add 'createdAt' and 'updatedAt' fields.
    timestamps: true
});

// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
//      Model Export
// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
const Order = mongoose.model('Order', orderSchema);
module.exports = Order;