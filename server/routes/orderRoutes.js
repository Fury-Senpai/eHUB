// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
//      Imports
// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
const express = require('express');
const {
    createOrder,
    getMyOrders,
    getAllOrders
} = require('../controllers/orderController');
const { protect, isSeller } = require('../middlewares/authMiddleware');

// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
//      Router Initialization
// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
const router = express.Router();

// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
//      Route Definitions
// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-

// --- Client Routes ---
// A logged-in user can create an order and view their own past orders.
router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);


// --- Seller-Only Route ---
// Only the seller can view all orders in the system.
router.get('/', protect, isSeller, getAllOrders);


// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
//      Router Export
// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
module.exports = router;
