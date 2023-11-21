import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

import React from "react";

const RouteAuth = ({ allowedRoles }) => {
  const { user } = useAuth();
  const location = useLocation();

  return (user) ? (
    <Outlet />
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );
};

export default RouteAuth;