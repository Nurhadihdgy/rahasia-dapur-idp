import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useAuthContext } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { Link, useNavigate } from 'react-router-dom';

const PublicLogin = () => {
  const [payload, setPayload] = useState({ email: '', password: '' });
  const { login: executeLogin, loading } = useAuth();
  const { login: setGlobalAuth } = useAuthContext();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await executeLogin(payload);
      setGlobalAuth(res.data.userResponse, res.data.accessToken);
      showToast('Selamat datang kembali!', 'success');
      navigate('/'); // Redirect ke home setelah login berhasil
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    // min-h-screen dan bg-dapur-cream untuk menyamakan background dengan Register
    <div className="min-h-screen w-screen flex items-center justify-center bg-dapur-cream p-4">
      {/* Kartu putih dengan rounded-[40px] agar identik dengan Register */}
      <div className="bg-white p-10 rounded-[40px] shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
        <p className="text-gray-500 mb-8">Masuk ke akun Rahasia Dapur Anda</p>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input 
            label="Email" 
            type="email" 
            placeholder="nama@email.com"
            onChange={(e) => setPayload({...payload, email: e.target.value})} 
            required 
          />
          
          <div className="space-y-1">
            <Input 
              label="Password" 
              type="password" 
              placeholder="••••••••"
              onChange={(e) => setPayload({...payload, password: e.target.value})} 
              required 
            />
          </div>

          <Button 
            type="submit" 
            className="w-full py-4 mt-2" 
            disabled={loading}
          >
            {loading ? 'Memproses...' : 'Login'}
          </Button>

          <p className="text-center text-sm text-gray-500">
            Belum punya akun?{' '}
            <Link to="/register" className="text-dapur-orange font-bold">Daftar</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default PublicLogin;