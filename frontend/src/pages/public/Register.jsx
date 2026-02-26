import React, { useState } from 'react';
import { authService } from '../../api/authService';
import { useToast } from '../../context/ToastContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [data, setData] = useState({ name: '', email: '', password: '',confirmPassword: '' });
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await authService.register(data);
      showToast("Registration successful! Please login.");
      navigate('/login');
    } catch (err) { showToast(err.message, "error"); }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-dapur-cream p-4">
      <div className="bg-white p-10 rounded-[40px] shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
        <p className="text-gray-500 mb-8">Join Rahasia Dapur community</p>
        <form onSubmit={handleRegister} className="space-y-5">
          <Input label="Full Name" onChange={e => setData({...data, name: e.target.value})} required />
          <Input label="Email" type="email" onChange={e => setData({...data, email: e.target.value})} required />
          <Input label="Password" type="password" onChange={e => setData({...data, password: e.target.value})} required />
          <Input label="Confirm Password" type="password" onChange={e => setData({...data, confirmPassword: e.target.value})} required />
          <Button className="w-full py-4">Sign Up</Button>
          <p className="text-center text-sm text-gray-500">
            Already have an account? <Link to="/login" className="text-dapur-orange font-bold">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};
export default Register;