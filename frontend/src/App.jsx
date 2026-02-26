import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./components/layout/AdminLayout";
import AdminLogin from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import ManageRecipes from "./pages/admin/ManageRecipes";
import Register from "./pages/public/Register";
import { useAuthContext } from "./context/AuthContext";
import PublicLayout from "./components/layout/PublicLayout";
import PublicLogin from "./pages/public/Login";
import PublicRecipes from "./pages/public/Recipes";
import Home from "./pages/public/Home";
import PublicTips from "./pages/public/Tips";
import Profile from "./pages/public/Profile";
import DetailRecipe from "./pages/public/DetailRecipe";
import DetailTips from "./pages/public/DetailTips";
import UbahProfil from "./pages/public/UbahProfil";
import UbahPassword from "./pages/public/UbahPassword";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageTips from "./pages/admin/ManageTips";

function App() {
  const { isAuthenticated, user, loading } = useAuthContext();

  if (loading) return null;
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="recipes" element={<PublicRecipes />} />
          <Route path="tips" element={<PublicTips />} />
          <Route path="login" element={<PublicLogin />} />
          <Route path="register" element={<Register />} />
          <Route path="profil" element={<Profile />} />
          <Route path="recipes/:id" element={<DetailRecipe />} />
          <Route path="tips/:id" element={<DetailTips />} />
          <Route path="ubah-profil" element={<UbahProfil />} />
          <Route path="change-password" element={<UbahPassword />} />
        </Route>

        {/* ADMIN LOGIN ROUTE (Gunakan path unik atau kondisional di dalam satu blok) */}
        <Route
          path="/admin"
          element={
            isAuthenticated && user?.role === "admin" ? (
              <Navigate to="/admin/dashboard" replace />
            ) : (
              <AdminLogin />
            )
          }
        />

        {/* ADMIN PROTECTED ROUTES (Hanya satu blok rute /admin) */}
        <Route
          path="/admin"
          element={
            isAuthenticated && user?.role === "admin" ? (
              <AdminLayout />
            ) : (
              <Navigate to="/admin" replace />
            )
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="recipes" element={<ManageRecipes />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="tips" element={<ManageTips />} />
        </Route>

        {/* CATCH ALL: Redirect jika rute tidak ditemukan */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;