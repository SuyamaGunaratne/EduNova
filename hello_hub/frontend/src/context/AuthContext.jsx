import { createContext, useContext, useEffect, useMemo, useState, useCallback, useRef } from "react";
import api from "../api/axiosClient";
import { useToast } from "./ToastContext";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { addToast } = useToast();
  const loginToastRef = useRef(null);
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

  const fetchMe = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/auth/me");
      setUser(res.data);
      return res.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const loginWithToken = useCallback((newToken) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);

    if (loginToastRef.current === newToken) {
      return;
    }

    loginToastRef.current = newToken;
    addToast("Logged in successfully", "success");
  }, [addToast]);

  const logout = useCallback((confirmLogout = true) => {
    if (confirmLogout && !window.confirm("Are you sure you want to log out of the system?")) {
      return false;
    }

    loginToastRef.current = null;
    setToken("");
    setUser(null);
    setRoleRequest(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("roleRequest");
    addToast("Logged out successfully", "success");
    return true;
  }, [addToast]);

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
