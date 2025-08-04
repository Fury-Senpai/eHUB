// 
//      Imports
// 
const express = require('express');
const {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory
} = require('../controllers/categoryController');
const { protect, isSeller } = require('../middlewares/authMiddleware');

// 
//      Router Initialization
// 
const router = express.Router();

// 
//      Route Definitions
// 

// --- Public Routes ---

router.get('/', getCategories);

// --- Seller-Only Routes ---
// The 'protect' middleware first checks for a valid JWT.
// The 'isSeller' middleware then checks if the user's role is 'Seller'.

// Create a new category
router.post('/', protect, isSeller, createCategory);

// Update or delete a specific category by its ID
router.route('/:id')
    .put(protect, isSeller, updateCategory)
    .delete(protect, isSeller, deleteCategory);

module.exports = router;
