import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

axios.defaults.withCredentials=true;
function Login(props) {
    const [values, setValues] = useState({
        email: '',
        password: ''
    })
    const navigate=useNavigate()
    const handleSubmit=(e)=>{
        e.preventDefault();
        axios.post('http://localhost:3000/login',values)
        .then(res=>{
            if(res?.data?.status==="success"){
                navigate("/")
            }
        })
        .catch(err => {
            console.log('Error:', err); 
            if (err.response) {
                alert(err.response?.data?.message || 'An unknown error occurred'); // Display the error message from the server
            } else {
                alert('A network error occurred or the server is unreachable.');
            }
        });
    }
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                    <input
                        type="text"
                        id="email"
                        placeholder='Enter your email'
                        name='email'
                        onChange={(e) => setValues({ ...values, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className="block text-sm font-medium mb-2">Password</label>
                    <input
                        type="password"
                        id="password"
                        placeholder='Enter your password'
                        name='password'
                        onChange={(e) => setValues({ ...values, password: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Log In
                </button>
                <Link
                    to="/register"
                    className="block text-center mt-4 text-blue-500 hover:underline"
                >
                    Do not have an account? Register here
                </Link>
            </form>
        </div>
    </div>
    );
}

export default Login;