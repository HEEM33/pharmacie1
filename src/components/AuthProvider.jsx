import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
     const savedUser = localStorage.getItem("user"); 
  if (savedToken) setToken(savedToken);
  if (savedUser) setUser(JSON.parse(savedUser));
    setLoading(false);
  }, []);

  const login = (newToken, userData) => {
    setToken(newToken);
  setUser(userData);
  localStorage.setItem("token", newToken);
  localStorage.setItem("user", JSON.stringify(userData));;
  };

  const logout = () => {
    setToken(null);
    setUser(null); 
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
