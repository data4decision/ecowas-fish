// src/context/AuthContext.js

import { createContext, useContext, useState, useEffect } from "react";

// Create the context
const AuthContext = createContext();

// ✅ Named export: AuthProvider
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Optional: simulate fetching user (e.g., from Firebase)
  useEffect(() => {
    const dummyUser = {
      name: "Jane Doe",
      email: "jane@example.com",
      role: "admin",
      countryCode: "NG"
    };
    setUser(dummyUser);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {
  return useContext(AuthContext);
}
