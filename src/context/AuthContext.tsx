"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  verifyCode: (email: string, code: string) => Promise<void>;
  signOut: () => void;
  pendingEmail: string | null;
  setPendingEmail: (email: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_TOKEN_KEY = "auth_token";
const USER_DATA_KEY = "user_data";

// Simulate API delays
const API_DELAY = 1500;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  // Check for existing auth token on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const token = localStorage.getItem(AUTH_TOKEN_KEY);
        const userData = localStorage.getItem(USER_DATA_KEY);

        if (token && userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error("Error loading auth data:", error);
        // Clear invalid data
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(USER_DATA_KEY);
      } finally {
        setIsLoading(false);
      }
    }
  }, []);

  const signIn = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, API_DELAY));

      // Mock validation - in real app, this would be an API call
      if (password.length < 6) {
        throw new Error("Invalid credentials");
      }

      // Set pending email for code verification
      setPendingEmail(email);
    } catch (error) {
      setIsLoading(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    name?: string
  ): Promise<void> => {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, API_DELAY));

      // Mock validation
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }

      if (!email.includes("@")) {
        throw new Error("Invalid email format");
      }

      // For now, we're not using the name parameter but it's available for future use
      console.log("Signing up with name:", name);

      // Set pending email for code verification
      setPendingEmail(email);
    } catch (error) {
      setIsLoading(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyCode = async (email: string, code: string): Promise<void> => {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, API_DELAY));

      // Mock validation - accept any 6-digit code
      if (code.length !== 6 || !/^\d{6}$/.test(code)) {
        throw new Error("Invalid verification code");
      }

      // Create mock user and token
      const mockUser: User = {
        id: Date.now().toString(),
        email: email,
        name: email.split("@")[0], // Use email prefix as name
      };

      const mockToken = `mock_token_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      // Save to localStorage
      localStorage.setItem(AUTH_TOKEN_KEY, mockToken);
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(mockUser));

      setUser(mockUser);
      setPendingEmail(null);
    } catch (error) {
      setIsLoading(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
    setUser(null);
    setPendingEmail(null);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    verifyCode,
    signOut,
    pendingEmail,
    setPendingEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
