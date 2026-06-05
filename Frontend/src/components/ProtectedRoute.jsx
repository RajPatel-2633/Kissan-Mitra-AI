import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#f4fcf6]">
        <Loader2 className="w-12 h-12 animate-spin text-[#2b9365]" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
