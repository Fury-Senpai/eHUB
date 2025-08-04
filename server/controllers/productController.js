// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
//      Imports
// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
const Product = require('../models/Product');
const Category = require('../models/Category');
const mongoose = require('mongoose'); // Import Mongoose to access its helper methods

// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
//      Controller Logic: Create Product
// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Private/Seller
 */
const createProduct = async (req, res) => {
    try {
        const { name, description, price, discount, category, subCategory, stock } = req.body;
        if (!name || !description || !price || !category || !subCategory || !stock) {
            return res.status(400).json({ message: 'Please provide all required product fields.' });
        }
        if (!req.file) {
            return res.status(400).json({ message: 'Product image is required.' });
        }
        const categoryExists = await Category.findById(category);
        if (!categoryExists || !categoryExists.subCategories.some(sub => sub.name === subCategory)) {
            return res.status(400).json({ message: 'Invalid category or sub-category.' });
        }
        const product = new Product({
            name, description, price, discount, category, subCategory, stock,
            imageUrl: `/uploads/${req.file.filename}`
        });
        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while creating product.' });
    }
};

// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
//      Controller Logic: Get Products
// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
/**
 * @desc    Fetch all products with search, filter, and pagination
 * @route   GET /api/products
 * @access  Public
 */
const getProducts = async (req, res) => {
    try {
        const pageSize = 12;
        const page = Number(req.query.pageNumber) || 1;
        const keyword = req.query.keyword ? { name: { $regex: req.query.keyword, $options: 'i' } } : {};
        const count = await Product.countDocuments({ ...keyword });
        const products = await Product.find({ ...keyword })
            .populate('category', 'name')
            .limit(pageSize)
            .skip(pageSize * (page - 1));
        res.json({ products, page, pages: Math.ceil(count / pageSize) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while fetching products.' });
    }
};

// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
//      Controller Logic: Get Product By ID
// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
/**
 * @desc    Fetch a single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = async (req, res) => {
    try {
        // --- FIX: Add validation check for the ID ---
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({ message: 'Product not found.' });
        }
        // --- End Fix ---

        const product = await Product.findById(req.params.id).populate('category', 'name');
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found.' });
        }
    } catch (error) {
        // The CastError will no longer happen, but we keep this for other potential errors.
        console.error(error);
        res.status(500).json({ message: 'Server error while fetching product.' });
    }
};

// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
//      Controller Logic: Update Product
// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
/**
 * @desc    Update a product
 * @route   PUT /api/products/:id
 * @access  Private/Seller
 */
const updateProduct = async (req, res) => {
    try {
        const { name, description, price, discount, category, subCategory, stock } = req.body;
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }
        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.discount = discount !== undefined ? discount : product.discount;
        product.category = category || product.category;
        product.subCategory = subCategory || product.subCategory;
        product.stock = stock !== undefined ? stock : product.stock;
        if (req.file) {
            product.imageUrl = `/uploads/${req.file.filename}`;
        }
        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while updating product.' });
    }
};

// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
//      Controller Logic: Delete Product
// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
/**
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 * @access  Private/Seller
 */
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            await product.deleteOne();
            res.json({ message: 'Product removed.' });
        } else {
            res.status(404).json({ message: 'Product not found.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while deleting product.' });
    }
};

// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
//      Exports
// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
};
