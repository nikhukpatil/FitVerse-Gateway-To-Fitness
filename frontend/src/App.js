import React, { useEffect, useState, lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./utils/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from 'react-redux';
import Loader from "./common/Loader";
import { getUser } from "./Redux/features/auth/authSlice";

// Lazy loading components
const Layout = lazy(() => import("./pages/Layout"));
const HomePage = lazy(() => import("./pages/HomePage"));
const Blogs = lazy(() => import("./pages/Blogs"));
const BMI = lazy(() => import("./pages/BMI"));
const Profile = lazy(() => import("./pages/Profile"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Signup = lazy(() => import("./pages/Signup"));
const Signin = lazy(() => import("./pages/Signin"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Diet = lazy(() => import("./pages/Diet"));
const BlogDetail = lazy(() => import("./component/blogs/BlogDetail"));
const CreateBlog = lazy(() => import("./component/blogs/CreateBlog"));
const EditBlog = lazy(() => import("./component/blogs/EditBlog"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  const { auth } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        await dispatch(getUser()).unwrap();
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [auth, dispatch]);

  if (loading) {
    return (
      <div className="fixed inset-0 overflow-hidden w-full h-full flex justify-center items-center z-50">
        <div className="w-32 h-32">
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Suspense fallback={<div className="fixed inset-0 overflow-hidden w-full h-full flex justify-center items-center z-50">
        <div className="w-32 h-32">
          <Loader />
        </div>
      </div>}>
        <Routes>
            <Route path="*" element={<NotFound/>} />
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="signup" element={auth === null ? <Signup /> : <Navigate to='/' replace={true} />} />
            <Route path="signin" element={auth === null ? <Signin /> : <Navigate to='/' replace={true} />} />
            <Route path="/diet" element={<Diet />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/create-blog" element={<ProtectedRoute><CreateBlog /></ProtectedRoute>} />
            <Route path="/edit-blog/:id" element={<ProtectedRoute><EditBlog /></ProtectedRoute>} />
            <Route path="/bmi" element={<BMI />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/profile/*" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
          </Route>
        </Routes>
      </Suspense>
      <Toaster position="top-center" />
    </div>
  );
}

export default App;
