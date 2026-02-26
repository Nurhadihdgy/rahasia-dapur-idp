import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useAuthContext } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Ilustrasi from "../../assets/images/hero-login.webp";

const AdminLogin = () => {
  const [payload, setPayload] = useState({ email: "", password: "" });
  const { loginAdmin: executeLogin, loading } = useAuth();
  const { login: setGlobalAuth } = useAuthContext();
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await executeLogin(payload);
    
    // 1. Ekstraksi data
    const { userResponse, accessToken } = res.data;

    // 2. Validasi Role
    if (userResponse.role !== 'admin') {
      showToast("Login Gagal!", "error");
      
      return; 
    }

    // 3. Simpan Sesi (Hanya jika lolos pengecekan role)
    setGlobalAuth(userResponse, accessToken);
    showToast("Welcome back, Admin!", "success");
    
  } catch (err) {
    const errorMsg = err.response?.data?.message || "Login gagal";
    showToast(errorMsg, "error");
  }

};

  return (
    <div className="min-h-screen w-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Welcome back to Rahasia Dapur
        </h1>
        <div className="bg-[#FDF6F0] rounded-3xl mb-10 overflow-hidden h-64 w-full">
          <img
            src={Ilustrasi}
            alt="Admin Illustration"
            className="w-full h-full object-cover"
          />
        </div>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
          <Input
            label="Email"
            type="email"
            placeholder="admin@dapur.com"
            onChange={(e) => setPayload({ ...payload, email: e.target.value })}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="Masukkan Password"
            onChange={(e) =>
              setPayload({ ...payload, password: e.target.value })
            }
            required
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Authenticating..." : "Login as Admin"}
          </Button>
        </form>
      </div>
    </div>
  );
};
export default AdminLogin;
