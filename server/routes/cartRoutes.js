
const express = require('express');
const {
    getCart,
    addItemToCart,
    removeItemFromCart
} = require('../controllers/cartController');
const { protect } = require('../middlewares/authMiddleware');

// 
//      Router Initialization
// 
const router = express.Router();

// 
//      Route Definitions
// 
// All cart routes are protected and require a user to be logged in.

// Get the user's cart
// Add an item to the cart or update its quantity
router.route('/')
    .get(protect, getCart)
    .post(protect, addItemToCart);

// Remove an item from the cart
router.delete('/:productId', protect, removeItemFromCart);


module.exports = router;
