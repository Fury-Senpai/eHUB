import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProductById, updateProduct, resetProducts } from '../redux/slices/productSlice';
import { getCategories } from '../redux/slices/categorySlice';
import { FaSpinner } from 'react-icons/fa';

const EditProductPage = () => {
    const { id: productId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector(state => state.auth);
    const { categories } = useSelector(state => state.categories);
    const { product, isLoading, isError, isSuccess, message } = useSelector(state => state.products);

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [subCategory, setSubCategory] = useState('');
    const [stock, setStock] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [description, setDescription] = useState('');

    useEffect(() => {
        // Redirect if user is not a seller
        if (!user || user.role !== 'Seller') {
            navigate('/login');
        }

        // If the update was successful, show an alert and navigate away
        if (isSuccess) {
            alert('Product Updated Successfully!');
            dispatch(resetProducts());
            navigate('/dashboard');
        } else {
            // If there's no product data in the state, or it's the wrong product, fetch it
            if (!product.name || product._id !== productId) {
                dispatch(getProductById(productId));
                dispatch(getCategories());
            } else {
                // Once product data is available, populate the form fields
                setName(product.name);
                setPrice(product.price);
                setCategoryId(product.category._id);
                setSubCategory(product.subCategory);
                setStock(product.stock);
                setDiscount(product.discount);
                setDescription(product.description);
            }
        }
    }, [user, navigate, dispatch, productId, product, isSuccess]);

    const submitHandler = (e) => {
        e.preventDefault();
        const productData = new FormData();
        productData.append('name', name);
        productData.append('price', price);
        if (image) productData.append('image', image);
        productData.append('category', categoryId);
        productData.append('subCategory', subCategory);
        productData.append('stock', stock);
        productData.append('discount', discount);
        productData.append('description', description);
        
        dispatch(updateProduct({ id: productId, productData }));
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold text-primary-orange mb-8">Edit Product</h1>
            {isLoading ? <div className="flex justify-center"><FaSpinner className="animate-spin text-primary-orange text-4xl"/></div> : isError ? <p className="text-red-500">{message}</p> : (
                <form onSubmit={submitHandler} className="space-y-6 bg-light-gray p-8 rounded-lg">
                    <div>
                        <label className="text-sm font-bold text-gray-300 block mb-2">Product Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 bg-dark-gray rounded border border-gray-600" required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-sm font-bold text-gray-300 block mb-2">Price ($)</label>
                            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full p-3 bg-dark-gray rounded border border-gray-600" required />
                        </div>
                        <div>
                            <label className="text-sm font-bold text-gray-300 block mb-2">Stock Quantity</label>
                            <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} className="w-full p-3 bg-dark-gray rounded border border-gray-600" required />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-sm font-bold text-gray-300 block mb-2">Category</label>
                            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full p-3 bg-dark-gray rounded border border-gray-600" required>
                                <option value="">Select Category</option>
                                {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-bold text-gray-300 block mb-2">Sub-Category</label>
                            <select value={subCategory} onChange={(e) => setSubCategory(e.target.value)} className="w-full p-3 bg-dark-gray rounded border border-gray-600" required disabled={!categoryId}>
                                <option value="">Select Sub-Category</option>
                                {categoryId && categories.find(c => c._id === categoryId)?.subCategories.map(sub => <option key={sub.name} value={sub.name}>{sub.name}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-bold text-gray-300 block mb-2">Discount (%)</label>
                        <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} className="w-full p-3 bg-dark-gray rounded border border-gray-600" />
                    </div>
                    <div>
                        <label className="text-sm font-bold text-gray-300 block mb-2">Change Image (Optional)</label>
                        <input type="file" onChange={(e) => setImage(e.target.files[0])} className="w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-orange file:text-dark-gray hover:file:bg-opacity-90" />
                    </div>
                    <div>
                        <label className="text-sm font-bold text-gray-300 block mb-2">Description</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="4" className="w-full p-3 bg-dark-gray rounded border border-gray-600" required></textarea>
                    </div>
                    <button type="submit" className="w-full py-3 font-bold text-dark-gray bg-primary-orange rounded hover:bg-opacity-90 transition-all">Update Product</button>
                </form>
            )}
        </div>
    );
};

export default EditProductPage;
