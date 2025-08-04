
const mongoose = require('mongoose');


//      Category Schema Definition


const categorySchema = new mongoose.Schema({
    
    name: {
        type: String,
        required: [true, 'Please provide a category name.'],
        unique: true,
        trim: true
    },
    
    subCategories: [{
        name: {
            type: String,
            required: true,
            trim: true
        }
    }]
}, {
    
    timestamps: true
});


const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
