import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, setAuthToken } from "../api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("prism_token"));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("prism_user");
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    setAuthToken(token);
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/auth/me")
      .then((response) => setUser(response.data))
      .catch(() => {
        localStorage.removeItem("prism_token");
        localStorage.removeItem("prism_user");
        setToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const persist = (nextToken, nextUser) => {
    setToken(nextToken);
    setUser(nextUser);
    setAuthToken(nextToken);
    localStorage.setItem("prism_token", nextToken);
    localStorage.setItem("prism_user", JSON.stringify(nextUser));
  };

  const login = async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    persist(response.data.token, response.data.user);
  };

  const register = async (username, email, password) => {
    const response = await api.post("/auth/register", { username, email, password });
    persist(response.data.token, response.data.user);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setAuthToken(null);
    localStorage.removeItem("prism_token");
    localStorage.removeItem("prism_user");
  };

  const refreshMe = async () => {
    if (!token) return;
    const response = await api.get("/auth/me");
    setUser(response.data);
    localStorage.setItem("prism_user", JSON.stringify(response.data));
  };

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      login,
      register,
      logout,
      refreshMe,
      isAdmin: user?.role === "Admin",
    }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
