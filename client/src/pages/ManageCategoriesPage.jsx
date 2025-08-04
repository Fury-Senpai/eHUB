// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
//      File: client/src/pages/ManageCategoriesPage.jsx
// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCategories, createCategory, deleteCategory, resetCategories } from '../redux/slices/categorySlice';
import { FaSpinner, FaTrash, FaPlus } from 'react-icons/fa';

const ManageCategoriesPage = () => {
    const [name, setName] = useState('');
    const [subCategoryInput, setSubCategoryInput] = useState('');
    const [subCategories, setSubCategories] = useState([]);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.auth);
    const { categories, isLoading, isError, isSuccess, message } = useSelector((state) => state.categories);

    useEffect(() => {
        if (!user || user.role !== 'Seller') {
            navigate('/login');
        }
        
        dispatch(getCategories());

        if (isError) {
            alert(message);
            dispatch(resetCategories());
        }

        if(isSuccess) {
            dispatch(resetCategories());
        }

    }, [user, navigate, isError, isSuccess, message, dispatch]);

    const handleAddSubCategory = () => {
        if (subCategoryInput && !subCategories.find(s => s.name === subCategoryInput)) {
            setSubCategories([...subCategories, { name: subCategoryInput }]);
            setSubCategoryInput('');
        }
    };

    const handleRemoveSubCategory = (subToRemove) => {
        setSubCategories(subCategories.filter(sub => sub.name !== subToRemove.name));
    };

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(createCategory({ name, subCategories }));
        setName('');
        setSubCategories([]);
    };

    const deleteHandler = (id) => {
        if (window.confirm('Are you sure you want to delete this category? This cannot be undone.')) {
            dispatch(deleteCategory(id));
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-primary-orange mb-8">Manage Categories</h1>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Add Category Form */}
                <div className="bg-light-gray p-6 rounded-lg">
                    <h2 className="text-2xl font-bold text-white mb-4">Add New Category</h2>
                    <form onSubmit={submitHandler} className="space-y-4">
                        <div>
                            <label className="text-sm font-bold text-gray-300 block mb-2">Category Name</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 bg-dark-gray rounded border border-gray-600" required />
                        </div>
                        <div>
                            <label className="text-sm font-bold text-gray-300 block mb-2">Sub-Categories</label>
                            <div className="flex">
                                <input type="text" value={subCategoryInput} onChange={(e) => setSubCategoryInput(e.target.value)} className="w-full p-3 bg-dark-gray rounded-l border border-gray-600" />
                                <button type="button" onClick={handleAddSubCategory} className="bg-primary-orange text-dark-gray p-3 rounded-r"><FaPlus /></button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {subCategories.map(sub => (
                                    <span key={sub.name} className="bg-dark-gray px-3 py-1 rounded-full text-sm flex items-center">
                                        {sub.name}
                                        <button type="button" onClick={() => handleRemoveSubCategory(sub)} className="ml-2 text-red-500">x</button>
                                    </span>
                                ))}
                            </div>
                        </div>
                        <button type="submit" className="w-full py-3 font-bold text-dark-gray bg-primary-orange rounded" disabled={isLoading}>
                            {isLoading ? <FaSpinner className="animate-spin mx-auto"/> : 'Create Category'}
                        </button>
                    </form>
                </div>

                {/* Existing Categories List */}
                <div className="bg-light-gray p-6 rounded-lg">
                    <h2 className="text-2xl font-bold text-white mb-4">Existing Categories</h2>
                    <div className="space-y-3">
                        {/* FIX: Add a fallback empty array to prevent crash */}
                        {(categories || []).map(cat => (
                            <div key={cat._id} className="bg-dark-gray p-3 rounded flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-off-white">{cat.name}</p>
                                    <p className="text-xs text-gray-400">{cat.subCategories.map(s => s.name).join(', ')}</p>
                                </div>
                                <button onClick={() => deleteHandler(cat._id)} className="text-gray-400 hover:text-red-500"><FaTrash /></button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageCategoriesPage;
