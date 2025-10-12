import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserSessionType } from "@/types";
import { fetchAuthenticateUser, fetchCheckTokenUser } from "@/lib/api";

type AuthContextType = {
  user: UserSessionType | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  logout: () => {},
  loading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserSessionType | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (username: string, password: string) => {
    try {
      const authUser = await fetchAuthenticateUser(username, password);
      setUser(authUser);
      await AsyncStorage.setItem("authUser", JSON.stringify(authUser));
      return true;
    } catch (error) {
      throw new Error("Credenciales inválidas o error de conexión.");
    }
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem("authUser");
  };

  const loadSession = async () => {
    try {
    
      const storedUser = await AsyncStorage.getItem("authUser");

      const authUser:UserSessionType|null = storedUser ? JSON.parse(storedUser) : null;

      if (authUser) {
        const isValid = await fetchCheckTokenUser(authUser.token);
        if (isValid) {
          setUser(authUser);
        } else {
          await logout();
        }
      }
    } catch (error) {
      console.error("Error loading session:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
