// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
//      Imports
// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
const express = require('express');
const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');
const { protect, isSeller } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
//      Router Initialization
// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
const router = express.Router();

// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
//      Route Definitions
// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-

// --- Public Routes ---
// Anyone can view products
router.get('/', getProducts);
router.get('/:id', getProductById);


// --- Seller-Only Routes ---
// The 'upload.single('image')' middleware handles a single file upload from a form field named 'image'.
// It must come before the controller action.

// Create a new product
router.post('/', protect, isSeller, upload.single('image'), createProduct);

// Update or delete a specific product
router.route('/:id')
    .put(protect, isSeller, upload.single('image'), updateProduct)
    .delete(protect, isSeller, deleteProduct);

// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
//      Router Export
// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
module.exports = router;
