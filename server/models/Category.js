// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
//      Imports
// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
const mongoose = require('mongoose');

// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
//      Category Schema Definition
// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
// This schema defines the structure for product categories.
const categorySchema = new mongoose.Schema({
    // The name of the main category (e.g., "Electronics", "Books").
    // It must be unique and is required.
    name: {
        type: String,
        required: [true, 'Please provide a category name.'],
        unique: true,
        trim: true
    },
    // An array to hold sub-categories within the main category.
    // (e.g., "Smartphones", "Laptops" under "Electronics").
    subCategories: [{
        name: {
            type: String,
            required: true,
            trim: true
        }
    }]
}, {
    // Automatically add 'createdAt' and 'updatedAt' fields.
    timestamps: true
});

// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
//      Model Export
// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
