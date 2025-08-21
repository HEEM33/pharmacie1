import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./AuthContext"; 

export default function PrivateRoute() {
  const { token, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Chargement...</div>; 
  }

  if (!token) {
    return <Navigate to="/authentification" replace />;
  }

  return <Outlet />;
}
