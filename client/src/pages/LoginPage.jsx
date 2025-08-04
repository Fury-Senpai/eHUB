
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { login, resetAuth } from '../redux/slices/authSlice';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const { email, password } = formData;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isError) {
            alert(message);
        }

        if (isSuccess || user) {
            navigate('/');
        }

      
        dispatch(resetAuth());
    }, [user, isError, isSuccess, message, navigate, dispatch]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = (e) => {
        e.preventDefault();
        const userData = { email, password };
        dispatch(login(userData));
    };

    return (
        <div className="flex justify-center">
            <div className="w-full max-w-md p-8 space-y-6 bg-light-gray rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-center text-primary-orange">Sign In</h1>
                <form onSubmit={onSubmit} className="space-y-6">
                    <div>
                        <label className="text-sm font-bold text-gray-300 block">Email</label>
                        <input type="email" name="email" value={email} onChange={onChange} className="w-full p-3 mt-2 bg-dark-gray rounded border border-gray-600 focus:border-primary-orange focus:ring focus:ring-primary-orange focus:ring-opacity-50" required />
                    </div>
                    <div>
                        <label className="text-sm font-bold text-gray-300 block">Password</label>
                        <input type="password" name="password" value={password} onChange={onChange} className="w-full p-3 mt-2 bg-dark-gray rounded border border-gray-600 focus:border-primary-orange focus:ring focus:ring-primary-orange focus:ring-opacity-50" required />
                    </div>
                    <div>
                        <button type="submit" className="w-full py-3 font-bold text-dark-gray bg-primary-orange rounded hover:bg-opacity-90 transition-all" disabled={isLoading}>
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </div>
                </form>
                <p className="text-center text-gray-400">
                    Don't have an account? <Link to="/register" className="font-bold text-primary-orange hover:underline">Sign Up</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;