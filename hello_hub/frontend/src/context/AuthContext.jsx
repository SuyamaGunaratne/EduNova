import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/axiosClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });
  const [roleRequest, setRoleRequest] = useState(() => {
    const raw = localStorage.getItem("roleRequest");
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      return;
    }

    localStorage.setItem("token", token);
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  useEffect(() => {
    if (roleRequest) {
      localStorage.setItem("roleRequest", JSON.stringify(roleRequest));
    } else {
      localStorage.removeItem("roleRequest");
    }
  }, [roleRequest]);

  const fetchMe = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/auth/me");
      setUser(res.data);
      return res.data;
    } finally {
      setLoading(false);
    }
  };

  const loginWithToken = (newToken) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };

  const logout = () => {
    setToken("");
    setUser(null);
    setRoleRequest(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("roleRequest");
  };

  const value = useMemo(
    () => ({
      token,
      user,
      roleRequest,
      loading,
      setUser,
      setRoleRequest,
      loginWithToken,
      fetchMe,
      logout
    }),
    [token, user, roleRequest, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
