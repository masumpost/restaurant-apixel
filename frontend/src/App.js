import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import { AuthProvider } from "./contexts/AuthContext";

// Layout
import Layout from "./components/Layout";
import AdminLayout from "./components/AdminLayout";

// Pages
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminBlogs from "./pages/admin/Blogs";
import AdminReviews from "./pages/admin/Reviews";
import AdminMessages from "./pages/admin/Messages";

// Protected Route
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="blogs" element={<AdminBlogs />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="messages" element={<AdminMessages />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster position="top-right" richColors />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
