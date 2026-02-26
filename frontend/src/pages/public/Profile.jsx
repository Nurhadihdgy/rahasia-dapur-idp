import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { authService } from "../../api/authService"; // Import service
import { User, Mail, ShieldCheck, LogOut, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

const Profile = () => {
  const { user, setUser, logout } = useAuthContext();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const res = await authService.getProfile();

        // Log untuk memastikan struktur data yang masuk
        console.log("Raw Response API:", res);

        // Pastikan akses data sesuai struktur: res.data (isi body) -> .success
        const responseBody = res.data;

        if (responseBody && responseBody.success) {
          // Berdasarkan JSON Anda: data { user: { ... } }
          // Maka aksesnya adalah responseBody.data.user
          setUser(responseBody.data.user);
        }
      } catch (err) {
        showToast("Gagal menyinkronkan data profil", "error");
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [setUser, showToast]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-dapur-orange" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl border border-gray-50 overflow-hidden">
        {/* Profile Header */}
        <div className="bg-dapur-orange p-10 text-center text-white">
          <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white/30">
            <User size={48} />
          </div>
          <h1 className="text-2xl font-bold">{user?.name}</h1>
          <p className="opacity-80 text-sm tracking-widest uppercase mt-1">
            {user?.role}
          </p>
        </div>

        {/* Info List */}
        <div className="p-10 space-y-6">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
            <div className="text-dapur-orange">
              <Mail size={24} />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs text-gray-400 font-bold uppercase">
                Email Address
              </p>
              <p className="text-gray-700 font-medium truncate">
                {user?.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
            <div className="text-dapur-orange">
              <ShieldCheck size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase">
                Account Status
              </p>
              <p className="text-green-600 font-bold italic">
                {user?.role === "admin" ? "Verified Admin" : "Verified User"}
              </p>
            </div>
          </div>
        </div>

        <div className="px-10 pb-10 flex gap-4">
          <Link
            to="/ubah-profil"
            className="flex-1 flex items-center justify-center border-2 border-dapur-orange text-dapur-orange hover:bg-dapur-orange hover:text-white font-bold rounded-2xl py-3 transition-all duration-300"
          >
            Ubah Profil
          </Link>

          <Link
            to="/change-password"
            className="flex-1 flex items-center justify-center border-2 border-dapur-orange text-dapur-orange hover:bg-dapur-orange hover:text-white font-bold rounded-2xl py-3 transition-all duration-300"
          >
            Ubah Password
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
