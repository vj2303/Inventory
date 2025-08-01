"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import axios from 'axios';

// Define types
interface User {
  authenticated: boolean;
  token: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  register: (userData: any) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  initiateLogin: (email: string) => Promise<any>;
  verifyOtp: (email: string, otp: string) => Promise<any>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in on initial load
    const checkUserLoggedIn = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          setUser({ authenticated: true, token });
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUserLoggedIn();
  }, []);

  const register = async (userData: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('name', userData.name);
      formData.append('email', userData.email);
      formData.append('password', userData.password);
      formData.append('role', userData.role || 'USER');
      
      if (userData.profilePicture) {
        formData.append('profilePicture', userData.profilePicture);
      }
      
      const response = await axios({
        method: 'post',
        baseURL: process.env.NEXT_PUBLIC_SERVER_HOSTNAME,
        url: '/api/auth/register',
        data: formData
      });
      
      return response.data;
    } catch (error: any) {
      setError(error?.response?.data?.message || "Registration failed");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login method that directly calls the login endpoint
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios({
        method: 'post',
        baseURL: process.env.NEXT_PUBLIC_SERVER_HOSTNAME,
        url: '/api/auth/login',
        headers: {
          'Content-Type': 'application/json'
        },
        data: JSON.stringify({ email, password })
      });
      
      // If login is successful but requires OTP verification
      if (response.data.requiresOtp) {
        return { requiresOtp: true, email };
      }
      
      // If login immediately returns a token
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        setUser({
          authenticated: true,
          token: response.data.token
        });
      }
      
      return response.data;
    } catch (error: any) {
      setError(error?.response?.data?.message || "Login failed");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Initiate login with email only (legacy support)
  const initiateLogin = async (email: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios({
        method: 'post',
        baseURL: process.env.NEXT_PUBLIC_SERVER_HOSTNAME,
        url: '/api/auth/login/initiate',
        headers: {
          'Content-Type': 'application/json'
        },
        data: JSON.stringify({ email })
      });
      
      return response.data;
    } catch (error: any) {
      setError(error?.response?.data?.message || "Login initiation failed");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP method
  const verifyOtp = async (email: string, otp: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios({
        method: 'post',
        baseURL: process.env.NEXT_PUBLIC_SERVER_HOSTNAME,
        url: '/api/auth/verify-otp',
        headers: {
          'Content-Type': 'application/json'
        },
        data: JSON.stringify({ email, otp })
      });
      
      const { token } = response.data;
      
      localStorage.setItem('authToken', token);
      
      setUser({
        authenticated: true,
        token
      });
      
      return response.data;
    } catch (error: any) {
      setError(error?.response?.data?.message || "OTP verification failed");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        login,
        initiateLogin,
        verifyOtp,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};






