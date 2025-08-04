// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
//      Imports
// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
const mongoose = require('mongoose');

// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
//      Product Schema Definition
// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
// This schema defines the structure for product documents.
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a product name.'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please provide a product description.']
    },
    price: {
        type: Number,
        required: [true, 'Please provide a price.']
    },
    // Discount is stored as a percentage, e.g., 15 for 15% off.
    discount: {
        type: Number,
        default: 0
    },
    // A reference to the main category this product belongs to.
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    // The specific sub-category name.
    subCategory: {
        type: String,
        required: true
    },
    // URL pointing to the product's image.
    imageUrl: {
        type: String,
        required: true
    },
    // The quantity of the product available in stock.
    stock: {
        type: Number,
        required: true,
        default: 1
    },
    // A counter to track how many times the product has been purchased.
    // This will help us identify "Most Purchased" items.
    purchaseCount: {
        type: Number,
        default: 0
    }
}, {
    // Automatically add 'createdAt' and 'updatedAt' fields.
    timestamps: true
});

// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
//      Model Export
// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
const Product = mongoose.model('Product', productSchema);
module.exports = Product;
