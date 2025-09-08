import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    const savedRoles = localStorage.getItem("roles"); 
  if (savedToken) setToken(savedToken);
  if (savedUser) setUser(JSON.parse(savedUser));
  if (savedRoles) setRoles(JSON.parse(savedRoles));
    setLoading(false);
  }, []);

  const login = (newToken, userData, rolesData) => {
    setToken(newToken);
  setUser(userData);
  setRoles(rolesData);
  localStorage.setItem("token", newToken);
  localStorage.setItem("user", JSON.stringify(userData));
  localStorage.setItem("roles", JSON.stringify(rolesData));;;
  };

  const logout = () => {
    setToken(null);
    setUser(null); 
    setRoles(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("roles");
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading, roles }}>
      {children}
    </AuthContext.Provider>
  );
};
