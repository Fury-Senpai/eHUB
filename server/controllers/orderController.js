const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');


//      Controller Logic: Create Order

/**
 * @desc    Create a new order from the user's cart
 * @route   POST /api/orders
 * @access  Private
 */
const createOrder = async (req, res) => {
    try {
        const userId = req.user._id;

        // 1. Find the user's cart and populate product details
        const cart = await Cart.findOne({ user: userId }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Your cart is empty.' });
        }

        // 2. Prepare order items and calculate total amount
        let totalAmount = 0;
        const orderItems = cart.items.map(item => {
            const product = item.product;
            if (!product) throw new Error('A product in your cart was not found.');

            // Calculate price after discount
            const priceAfterDiscount = product.price * (1 - (product.discount || 0) / 100);
            totalAmount += item.quantity * priceAfterDiscount;

            // Update product stock and purchase count
            product.stock -= item.quantity;
            product.purchaseCount += item.quantity;
            
            return {
                product: product._id,
                name: product.name,
                quantity: item.quantity,
                price: priceAfterDiscount
            };
        });

        // 3. Create the new order
        const order = new Order({
            user: userId,
            items: orderItems,
            totalAmount: totalAmount,
            
            shippingAddress: req.body.shippingAddress || {},
        });

        const createdOrder = await order.save();
        
        // 4. Update stock and purchase count for each product in the order
        for (const item of cart.items) {
            await Product.updateOne(
                { _id: item.product._id },
                { $inc: { stock: -item.quantity, purchaseCount: item.quantity } }
            );
        }

        // 5. Clear the user's cart
        await Cart.deleteOne({ user: userId });

        res.status(201).json(createdOrder);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Server error while creating order: ${error.message}` });
    }
};


//      Controller Logic: Get User's Orders

/**
 * @desc    Get logged in user's orders
 * @route   GET /api/orders/myorders
 * @access  Private
 */
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while fetching orders.' });
    }
};


//      Controller Logic: Get All Orders (for Seller)

/**
 * @desc    Get all orders
 * @route   GET /api/orders
 * @access  Private/Seller
 */
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'id name').sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while fetching all orders.' });
    }
};



//      Exports

module.exports = {
    createOrder,
    getMyOrders,
    getAllOrders
};
