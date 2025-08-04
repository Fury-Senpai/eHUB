// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
//      Imports
// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
//      Controller Logic: Get User's Cart
// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
/**
 * @desc    Get user's shopping cart
 * @route   GET /api/cart
 * @access  Private
 */
const getCart = async (req, res) => {
    try {
        // Find the cart for the logged-in user and populate product details
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name price imageUrl');
        if (!cart) {
            // If no cart exists, return an empty one.
            return res.json({ items: [] });
        }
        res.json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while fetching cart.' });
    }
};

// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
//      Controller Logic: Add/Update Item in Cart
// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
/**
 * @desc    Add an item to the cart or update its quantity
 * @route   POST /api/cart
 * @access  Private
 */
const addItemToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user._id;

        // 1. Find the user's cart
        let cart = await Cart.findOne({ user: userId });

        // 2. If no cart exists, create a new one
        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }

        // 3. Check if the product already exists in the cart
        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

        if (itemIndex > -1) {
            // Product exists, update the quantity
            cart.items[itemIndex].quantity = quantity;
        } else {
            // Product does not exist, add it to the cart
            cart.items.push({ product: productId, quantity });
        }

        // 4. Save the cart and populate the product details for the response
        await cart.save();
        const populatedCart = await cart.populate('items.product', 'name price imageUrl');
        res.status(200).json(populatedCart);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while adding to cart.' });
    }
};

// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
//      Controller Logic: Remove Item from Cart
// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
/**
 * @desc    Remove an item from the cart
 * @route   DELETE /api/cart/:productId
 * @access  Private
 */
const removeItemFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user._id;

        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found.' });
        }

        // Filter out the item to be removed
        cart.items = cart.items.filter(item => item.product.toString() !== productId);

        await cart.save();
        const populatedCart = await cart.populate('items.product', 'name price imageUrl');
        res.json(populatedCart);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while removing from cart.' });
    }
};

// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
//      Exports
// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
module.exports = {
    getCart,
    addItemToCart,
    removeItemFromCart
};
