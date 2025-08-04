
const mongoose = require('mongoose');


//      Product Schema Definition


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

    discount: {
        type: Number,
        default: 0
    },
    
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    
    subCategory: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        default: 1
    },
    
    purchaseCount: {
        type: Number,
        default: 0
    }
}, {
    
    timestamps: true
});


const Product = mongoose.model('Product', productSchema);
module.exports = Product;
