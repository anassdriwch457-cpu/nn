import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { useAuth } from "./context/AuthContext";
import { HomePage } from "./pages/HomePage";
import { ComicDetailPage } from "./pages/ComicDetailPage";
import { ReaderPage } from "./pages/ReaderPage";
import { BuyCoinsPage } from "./pages/BuyCoinsPage";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AdminComicsPage } from "./pages/AdminComicsPage";
import { AdminUsersPage } from "./pages/AdminUsersPage";
import { LoginPage } from "./pages/LoginPage";

const AdminGuard = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <p className="text-slate-300">Checking admin session...</p>;
  if (!user || !isAdmin) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/buy-coins" element={<BuyCoinsPage />} />
        <Route path="/comics/:comicId" element={<ComicDetailPage />} />
        <Route path="/comics/:comicId/read/:chapterId" element={<ReaderPage />} />

        <Route
          path="/admin/dashboard"
          element={
            <AdminGuard>
              <AdminDashboard />
            </AdminGuard>
          }
        />
        <Route
          path="/admin/comics"
          element={
            <AdminGuard>
              <AdminComicsPage />
            </AdminGuard>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminGuard>
              <AdminUsersPage />
            </AdminGuard>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
