"use client";

import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const [token, setToken] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false); // ✅

  useEffect(() => {
    setIsClient(true); 
    const savedToken = localStorage.getItem("authToken");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  if (!isClient) return null; // ✅ tránh render khi đang SSR

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};