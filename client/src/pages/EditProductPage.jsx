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
        if (!user || user.role !== 'Seller') {
            navigate('/login');
        }

        if (isSuccess) {
            alert('Product Updated Successfully!');
            navigate('/dashboard');
        } else {
            if (!product.name || product._id !== productId) {
                dispatch(getProductById(productId));
                dispatch(getCategories());
            } else {
                setName(product.name);
                setPrice(product.price);
                setCategoryId(product.category._id);
                setSubCategory(product.subCategory);
                setStock(product.stock);
                setDiscount(product.discount);
                setDescription(product.description);
            }
        }

        return () => {
            dispatch(resetProducts());
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
            {isLoading ? <FaSpinner className="animate-spin"/> : isError ? <p className="text-red-500">{message}</p> : (
                <form onSubmit={submitHandler} className="space-y-6 bg-light-gray p-8 rounded-lg">
                    {/* Form fields are the same as AddProductPage, pre-populated with data */}
                    {/* ... form inputs for name, price, stock, etc. ... */}
                     <button type="submit" className="w-full py-3 font-bold text-dark-gray bg-primary-orange rounded">Update Product</button>
                </form>
            )}
        </div>
    );
};

export default EditProductPage;
