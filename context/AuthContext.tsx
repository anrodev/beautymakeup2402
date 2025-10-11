import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserType } from "@/types";
import { authenticateUser, checkTokenUser } from "@/lib/api";

type AuthContextType = {
  user: UserType | null;
  token: string | null;
  login: (username: string, password: string) => void;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: async () => false,
  logout: () => {},
  loading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (username: string, password: string) => {
    try {
      const authentication = await authenticateUser(username, password);
      const token = authentication.token;
      const userData: UserType = {
        id: authentication.id,
        email: authentication.user_email,
        nicename: authentication.user_nicename,
        displayName: authentication.user_display_name,
      };

      setToken(token);
      setUser(userData);
      await AsyncStorage.setItem("authToken", token);
      await AsyncStorage.setItem("authUser", JSON.stringify(userData));
    } catch (error) {
      throw new Error("Credenciales inválidas o error de conexión.");
    }
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    await AsyncStorage.removeItem("authToken");
    await AsyncStorage.removeItem("authUser");
  };

  const loadSession = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("authToken");
      const storedUser = await AsyncStorage.getItem("authUser");

      if (storedToken && storedUser) {
        const isValid = await checkTokenUser(storedUser);
        if (isValid) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
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
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
