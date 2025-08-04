
import React, { useState, useEffect } from 'react'; 
import { Link as RouterLink, useNavigate as useRouterNavigate } from 'react-router-dom';
import { useDispatch as useAppDispatch, useSelector as useAppSelector } from 'react-redux';
import { register, resetAuth as resetAuthAction } from '../redux/slices/authSlice';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: '',
        role: 'Client'
    });
    const { name, email, password, password2, role } = formData;

    const navigate = useRouterNavigate();
    const dispatch = useAppDispatch();

    const { user, isLoading, isError, isSuccess, message } = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (isError) {
            alert(message);
        }
        if (isSuccess || user) {
            navigate('/');
        }
        dispatch(resetAuthAction());
    }, [user, isError, isSuccess, message, navigate, dispatch]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (password !== password2) {
            alert('Passwords do not match!');
        } else {
            const userData = { name, email, password, role };
            dispatch(register(userData));
        }
    };

    return (
        <div className="flex justify-center">
            <div className="w-full max-w-md p-8 space-y-6 bg-light-gray rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-center text-primary-orange">Create Account</h1>
                <form onSubmit={onSubmit} className="space-y-4">
                    <input type="text" name="name" value={name} onChange={onChange} placeholder="Name" required className="w-full p-3 bg-dark-gray rounded border border-gray-600 focus:border-primary-orange focus:ring-primary-orange"/>
                    <input type="email" name="email" value={email} onChange={onChange} placeholder="Email" required className="w-full p-3 bg-dark-gray rounded border border-gray-600 focus:border-primary-orange focus:ring-primary-orange"/>
                    <input type="password" name="password" value={password} onChange={onChange} placeholder="Password" required className="w-full p-3 bg-dark-gray rounded border border-gray-600 focus:border-primary-orange focus:ring-primary-orange"/>
                    <input type="password" name="password2" value={password2} onChange={onChange} placeholder="Confirm Password" required className="w-full p-3 bg-dark-gray rounded border border-gray-600 focus:border-primary-orange focus:ring-primary-orange"/>
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-300">Register as:</span>
                        <label className="flex items-center">
                            <input type="radio" name="role" value="Client" checked={role === 'Client'} onChange={onChange} className="form-radio text-primary-orange"/>
                            <span className="ml-2 text-off-white">Client</span>
                        </label>
                        <label className="flex items-center">
                            <input type="radio" name="role" value="Seller" checked={role === 'Seller'} onChange={onChange} className="form-radio text-primary-orange"/>
                            <span className="ml-2 text-off-white">Seller</span>
                        </label>
                    </div>
                    <button type="submit" className="w-full py-3 font-bold text-dark-gray bg-primary-orange rounded hover:bg-opacity-90 transition-all" disabled={isLoading}>
                        {isLoading ? 'Registering...' : 'Sign Up'}
                    </button>
                </form>
                <p className="text-center text-gray-400">
                    Already have an account? <RouterLink to="/login" className="font-bold text-primary-orange hover:underline">Sign In</RouterLink>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage 