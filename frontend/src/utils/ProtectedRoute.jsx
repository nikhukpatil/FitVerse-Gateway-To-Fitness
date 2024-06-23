import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../Redux/features/auth/authSlice';
import Loader from '../common/Loader';

const useAuth = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        await dispatch(getUser()).unwrap();
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [dispatch]);

  return { user, loading };
};

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="fixed inset-0 overflow-hidden w-full h-full bg-white flex justify-center items-center z-50">
    <div className=" w-32 h-32">
    <Loader />
    </div>
  </div>
  }

  if (!user) {
    return <Navigate to="/signin" />;
  }

  return children;
};