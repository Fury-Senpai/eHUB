
//      Imports

const Category = require('../models/Category');

//      Controller Logic: Create Category

/**
 * @desc    Create a new category
 * @route   POST /api/categories
 * @access  Private/Seller
 */
const createCategory = async (req, res) => {
    try {
        const { name, subCategories } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Category name is required.' });
        }

        // Check if category already exists (case-insensitive)
        const categoryExists = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
        if (categoryExists) {
            return res.status(400).json({ message: 'Category with this name already exists.' });
        }

        const category = new Category({
            name,
            subCategories: subCategories || [] // Optional: create with sub-categories
        });

        const createdCategory = await category.save();
        res.status(201).json(createdCategory);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while creating category.' });
    }
};


//      Controller Logic: Get All Categories

/**
 * @desc    Get all categories and their sub-categories
 * @route   GET /api/categories
 * @access  Public
 */
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({});
        res.json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while fetching categories.' });
    }
};


//      Controller Logic: Update Category

/**
 * @desc    Update a category's name or sub-categories
 * @route   PUT /api/categories/:id
 * @access  Private/Seller
 */
const updateCategory = async (req, res) => {
    try {
        const { name, subCategories } = req.body;
        const category = await Category.findById(req.params.id);

        if (category) {
            category.name = name || category.name;
            // Note: This replaces all sub-categories. Client should send the full, updated list.
            if (subCategories) {
                category.subCategories = subCategories;
            }
            const updatedCategory = await category.save();
            res.json(updatedCategory);
        } else {
            res.status(404).json({ message: 'Category not found.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while updating category.' });
    }
};


//      Controller Logic: Delete Category

/**
 * @desc    Delete a category
 * @route   DELETE /api/categories/:id
 * @access  Private/Seller
 */
const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (category) {
            await category.deleteOne(); 
            res.json({ message: 'Category removed.' });
        } else {
            res.status(404).json({ message: 'Category not found.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while deleting category.' });
    }
};



//      Exports

module.exports = {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory
};
