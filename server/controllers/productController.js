// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
//      File: server/controllers/productController.js
// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
const Product = require('../models/Product');
const Category = require('../models/Category');
const mongoose = require('mongoose');
// Import Node.js core modules for file system and path manipulation
const fs = require('fs');
const path = require('path');

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
        if (!mongoose.Types.ObjectId.isValid(category)) {
            return res.status(400).json({ message: 'Invalid category ID.' });
        }

        const categoryExists = await Category.findById(category);
        if (!categoryExists || !categoryExists.subCategories.some(sub => sub.name === subCategory)) {
            return res.status(400).json({ message: 'Category or sub-category not found.' });
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


/**
 * @desc    Fetch a single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({ message: 'Product not found.' });
        }
        const product = await Product.findById(req.params.id).populate('category', 'name');
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while fetching product.' });
    }
};

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

        // If a new image file is part of the request, delete the old one.
        if (req.file) {
            // Construct the full path to the old image file.
            const oldImagePath = path.join(__dirname, '..', product.imageUrl);
            
            // Use fs.unlink to delete the file from the server's storage.
            fs.unlink(oldImagePath, (err) => {
                if (err) console.error("Error deleting old image:", err);
            });
            
            // Update the product's imageUrl to the new path.
            product.imageUrl = `/uploads/${req.file.filename}`;
        }

        // Update other fields
        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.discount = discount !== undefined ? discount : product.discount;
        product.category = category || product.category;
        product.subCategory = subCategory || product.subCategory;
        product.stock = stock !== undefined ? stock : product.stock;

        const updatedProduct = await product.save();
        res.json(updatedProduct);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while updating product.' });
    }
};

/**
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 * @access  Private/Seller
 */
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            // Before deleting the product from the database, delete its image file.
            const imagePath = path.join(__dirname, '..', product.imageUrl);
            
            // Use fs.unlink to remove the file.
            fs.unlink(imagePath, (err) => {
                if (err) {
                    // Log the error but don't stop the process. We still want to
                    // remove the product from the database even if the file is missing.
                    console.error("Could not delete product image from server:", err);
                }
            });

            // Now, delete the product from the database.
            await product.deleteOne();
            res.json({ message: 'Product removed successfully.' });
        } else {
            res.status(404).json({ message: 'Product not found.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while deleting product.' });
    }
};

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
};
